const error_city = document.getElementById("er_city"); 
const error_date = document.getElementById("er_date"); 


async function handelsubment(event) {
    event.preventDefault(); 

    const date = document.getElementById("date").value;

   const location = await getCountry();

    // console.log("The Location:",location);

    if(!Validate_Input()){
        return;
    }

    if(!location){
        error_city.innerHTML = "The Location Not Exist";
        error_city.style.display ="block";
    }
    else{
        const {lng,lat,name} = location;
      // console.log("lng ",lng,"lat ",lat,"name ",name);

    if(lng && lat){
        const days = getdays(date); // Remaing days Until Travell To City 

//  console.log("THe Days num",days);
  
     const weather = await getweather(lng,lat,days);

//  console.log("The value is",weather);


    const image  = await getcityImage(name)
  //  console.log("The Value Image In Client",image);


     updateUI(name,date,days,weather,image);
    }
    }



}


async function updateUI(city,date,days,weather,image){

     if(days>=0){
        document.getElementById("Rdays").innerHTML = 
        `The Reaming Days To Travel<mark> ${days}</mark>`;

        document.getElementById("cityname").innerHTML =
        `the Country he wents To Travell <mark>${city}</mark>`;

        document.getElementById("travelDate").innerHTML = 
        `The Travell Date is:<mark> ${date}</mark>`;

        document.getElementById("temp").innerHTML = days >7 ?
        `The Expected temperature is:<mark>${weather.temp}</mark> and The Temp max:<mark>${weather.app_max_temp}</mark>
        and The temp min:<mark>${weather.app_min_temp}</mark>`:
        `The Temperature is: <mark>${weather.temp}</mark>`;

        document.getElementById("weather").innerHTML = days > 7?
        `The Expected Weather is <mark>${weather.description}</mark>`:
        `The weather is :${weather.description}`;

        document.getElementById("cityImage").innerHTML =
        `<img src="${image.image}" alt="The image Is not found">`;
      }
}


async function getcityImage(name) {
    
    try{
        const res = await fetch("http://localhost:4000/getimage",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name})
        });
        const data = await res.json();

        //console.log(data); 

        return data;
    }catch(e){
        console.log("error ",e); 


    }
}

async function getweather(lng,lat,days) {

    try{

      if(days<0){
        // console.log("days ",days);
        return {error:true,message:"can not insert date in past"};
      }
    const res = await fetch("http://localhost:4000/getweather",{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({lng,lat,days})
  });

  const alldata = await res.json();
//console.log("The Data is Client ",alldata);

  return alldata;


    }catch(e){
        console.log("error in fetch Data ",e);


    }
    

}

async function getCountry() {
    
    const city = document.getElementById("city").value;

    
    if(city){

        try{
        const res = await fetch("http://localhost:4000/getcity",
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({city})
            } 
            );
         const alldata = await res.json();
      //  console.log("alldata* ",alldata );
        

         return alldata;

        }catch(e){
        console.log("error ",e);
        }

    }else{
    error_city.innerHTML = "This field cannot be  empty";
    error_city.style.display = "block";
    }
}



async function Validate_Input(){

    error_city.style.display = "none";
    error_date.style.display ="none";

  const city = document.getElementById("city").value;
  const date = document.getElementById("date").value;

  if(!city){
    error_city.innerHTML = "Please insert The City";
    error_city.style.display = "block";
    return;

  }

  if(!date){
    error_date.innerHTML = "Please insert The  Date";
    error_date.style.display = "block";
    return;
    
  }
  if(getdays(date)<0){
    error_date.innerHTML = " Invalid  Date ";
    error_date.style.display = "block";
    return;
  }

  error_city.style.display = "none";
  error_date.style.display ="none";
  
  return true;

}

function getdays(date){
const now = new Date();

const travelDate = new Date(date);

const timed = travelDate.getTime()-now.getTime();

const days = Math.ceil(timed/(1000*3600*24));

return days;
}

export {handelsubment};