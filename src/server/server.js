
/*run server and routes */
const express = require('express'); 

/* Start up an instance of app */
const app = express();

app.use(express.json());

const bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

const cors = require('cors');
app.use(cors()); 


const dotenv = require('dotenv');
dotenv.config();

// main project folder
app.use(express.static('dist'));


const port = 4000;

// Set Up The Server
app.listen(port,()=>{

console.log(`running on localhost: ${port}`);    
});

app.get('/',(req,res)=>{
    res.sendFile(path.resolve('dist/index.html'));
});

const userstring = process.env.USER;
const userint = process.env.USERINT;
const username = userstring.concat(userint);

const api_key_weather = process.env.API_KEY_WEATHER;
const api_key_apix = process.env.API_PIXAPAY;

//http://api.geonames.org/searchJSON?q=london&maxRows=1&username=ameendababat
app.post('/getcity',async (req,res) =>{


        const city  = req.body.city; 
    

    // console.log("The username is ",username );
    try{
        
        //console.log("The City is ",city );  
        const apiurl =`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`;

        // const fetch = (await import('node-fetch')).default;
        const response = await fetch(apiurl); 
         
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();   
        
        if(!data.geonames.length){
            // const errormaseg ={
            //     massege :'No City That Name',
            //     error:true

            // }
            // return errormaseg; 

            return res.status(404).json({ message: "No city found with that name", error: true });
        }


        const {lng,lat,name} = data.geonames[0]; 

       
        const location = {lng,lat,name}; 
        console.log("location ",location);


         res.send(location);
        //  console.log("location ",location);
        //  console.log(lng); 
        // console.log(lat);  
        // console.log(name); 
    
    }catch(e){
        res.status(500).json({ message: 'Failed to fetch data', error: e.message });
    }
    

});

//API Get Weather Data Current Or Forcast Data 
app.post("/getweather",async (req,res)=> {
    const {lng,lat,days} = req.body;

    if(days<0){
        const errMsg = {
            message:"date cannot be in the past",
            error:true
        }
        return errMsg
    }

    try{
        // const fetch = (await import('node-fetch')).default;

        if(days >= 0 &&days <= 7){
     
            const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${api_key_weather}&lang=en&include=minutely`);

            const data = await response.json();

            const {temp ,weather} = data.data[0];

            

            const description  = weather.description;

            res.send({temp,description});
        } else if(days >7){
            const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${api_key_weather}&lang=en&days=${days}&units=M`);

            const data = await response.json();
             //console.log(data.data[data.data.length -1 ]);

             const {weather,temp,app_max_temp,app_min_temp} = data.data[data.data.length-1];

             // console.log("The Data is ",weather,temp,app_max_temp,app_min_temp);

             const description = weather.description;

             res.send({description,temp,app_max_temp,app_min_temp});


        }

    }catch(e){
        console.log("error ",e);

    }

});



// API  get image City
app.post("/getimage",async (req,res) => {

    const name = req.body;
   //console.log("the Name of Country is:",name.name);

   try{
 
    const api =  `https://pixabay.com/api/?key=${api_key_apix}&image_type=photo&q= ${name.name}`;

  const response = await fetch(api);

  const data = await response.json();

  let image;
  if((data.hits[0].webformatURL)){
    image = data.hits[0].webformatURL;

  }else{
    image = "https://images.unsplash.com/photo-1726533870778-8be51bf99bb1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  }

     //console.log("The Result:",{image});

     res.send({image});

   }catch(e){
    res.status(500).json({message: 'Failed to fetch data', error: e.message });
   }

});



