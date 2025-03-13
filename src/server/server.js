// ameen ahmad dababat
// ameendababat07@gmail.com

/* server and routes */
const express = require('express'); 

/* start instance of app */
const app = express();

app.use(express.json());

const bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

const cors = require('cors');
app.use(cors()); 


const dotenv = require('dotenv');
dotenv.config();

//the  main    
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

const apikey_weather = process.env.API_KEY_WEATHER;
const apikey_apix = process.env.API_PIXAPAY;

// ameen ahmad dababat
// ameendababat07@gmail.com

//http://api.geonames.org/searchJSON?q=london&maxRows=1&username=ameendababat
app.post('/getcity', async (req, res) => {
    
    const city = req.body.city;
    // console.log("city ",city);

    if (!city) {
        return res.status(400).json({ message: "City name is required", error: true });
    }

    try {
        const apiurl = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${username}`;
        // console.log("Fetching:", apiurl);

        const response = await fetch(apiurl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("API Response:", data);

        if (!data.geonames || data.geonames.length === 0) {
            return res.status(404).json({ message: "No city found with that name", error: true });
        }

        const { lng, lat, name } = data.geonames[0];
        const location = { lng, lat, name };

        // console.log("Sending Response:", location);
        return res.json(location);  

    } catch (e) {
        console.error("Server Error:", e.message);
        return res.status(500).json({ message: "Failed to fetch data", error: e.message });
    }
});

//get weather data current or forcast  
app.post("/getWeather",async (req,res)=> {

    // console.log("received body:", req.body); // testing
    
    const {lng,lat,days} = req.body;

    if(days<0){
        const errMsg = {
            message:"date cannot  in the past",
            error:true
        }
        return res.status(400).json(errMsg);
    }

    try{
        // const fetch = (await import('node-fetch')).default; // testing

        if(days >= 0 &&days <= 7){
            // &include=minutely
            const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&key=${apikey_weather}&lang=en`);

            const dataa = await response.json();
            // console.log("✅ API Response:", dataa); // testing

            const {temp ,weather} = dataa.data[0];
        //  console.log("temp ",temp,"weather ",weather); //trsting
            

            const description  = weather.description;
            // console.log("description ",description); // testing

            res.send({temp,description});
        } else if(days >7){
            const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${apikey_weather}&lang=en&days=${days}&units=M`);

            const data = await response.json();
             //console.log(data.data[data.data.length -1 ]);
             if (!data || !data.data || data.data.length === 0) {
                return res.status(404).json({ message: "No weather data found", error: true });
            }

             const {weather,temp,app_max_temp,app_min_temp} = data.data[data.data.length-1];

             // console.log(" data is ",weather,temp,app_max_temp,app_min_temp);// testing

             const description = weather.description;

             res.send({description,temp,app_max_temp,app_min_temp});


        }

    }catch(e){
        console.log("error ",e);
        res.status(500).json({ message: "Failed to fetch weather data", error: e.message });

    }

});



//  get image City
app.post("/getimage",async (req,res) => {

    const name = req.body.cityName;
//    console.log(" Name of Country:",name);

   try{
 
    const api =  `https://pixabay.com/api/?key=${apikey_apix}&image_type=photo&q= ${name}`;

  const response = await fetch(api);

  const data = await response.json();

  let image;
  if((data.hits[0].webformatURL)){
    image = data.hits[0].webformatURL;

  }else{
    image = "https://images.unsplash.com/photo-1726533870778-8be51bf99bb1?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  }

    //  console.log("The Result:",{image});

     res.send({image});

   }catch(e){
    res.status(500).json({message: 'Failed to fetch data', error: e.message });
   }

});


app.get('/favicon.ico', (req, res) => res.status(204).end());

