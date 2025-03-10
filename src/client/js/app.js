const errMsg_city = document.getElementById("er_city"); 
const errMsg_date = document.getElementById("er_date"); 


async function handelsubment(event) {
    event.preventDefault(); 

    const date = document.getElementById("date").value;

    const loc = await fetchCountry();

    // console.log("The Location:",loc);

    if(!validateInput()){
        return;
    }

    if(!loc){
      errMsg_city.innerHTML = "The Location Not Exist";
      errMsg_city.style.display ="block";
    }
    else{
        const {lng,lat,name} = loc;
      console.log("lng ",lng,"lat ",lat,"name ",name);

    if(lng && lat){
        const days = getdays(date); 

//  console.log("THe Days num",days);
  
     const weather = await fetchWeather(lng,lat,days);

//  console.log("The value is",weather);


    const image  = await fetchCityImage(name);
  //  console.log("The Value Image In Client",image);


     updateUI(name,date,days,weather,image);
    }
    }



}


async function updateUI(city,date,days,weather,image){

     if(days>=0){
       const travelInfo = document.querySelector('.travel_Info');
       travelInfo.innerHTML = `
       <h2>Trip Details</h2>
       <p><strong>Destination:</strong> <mark>${city}</mark> </p>
       <p><strong>Travel Date:</strong> <mark>${date}</mark></p>
       <p><strong>Days Remaining:</strong> <mark>${days}</mark></p>
       <p><strong>Temperature:</strong> ${days > 7 ? `Expected: <mark>${weather.temp}</mark> | Max: <mark>${weather.app_max_temp}</mark> | Min: <mark>${weather.app_min_temp}</mark>` 
        : `<mark>${weather.temp}</mark>`}</p>
       <p><strong>Weather description:</strong> <mark>${weather.description}</mark></p>
       <div class="image-container">
                <img src="${image.image}" alt="image Not Available">
       </div>
       `;
        

      }
}


async function fetchCityImage(cityName) {
    
    try{
        const response = await fetch("http://localhost:4000/getimage",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({cityName})
        });
        // const data = await response.json();

        //console.log(data); 

        return await response.json();
    }catch(e){
        console.error("not fetching city image ",e); 


    }
}

async function fetchWeather(lng,lat,days) {

    try{

      if(days<0){
        // console.log("days ",days);
        return {error:true,message:"not insert date in past"};
      }
    const response = await fetch("http://localhost:4000/getWeather",{
      
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({lng,lat,days})
  });

  // const dataa = await response.json();
//console.log("data Client ",dataa);

  return await response.json();


    }catch(e){
        console.log("Error fetching data ",e);


    }
    

}

async function fetchCountry() {
    
    const city = document.getElementById("city").value;

    if (!city) {
      errMsg_city.innerHTML = "This field cannot  empty";
      errMsg_city.style.display = "block";
      return;
  }
    
        try{
        const response = await fetch("http://localhost:4000/getcity",
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city })
            });

        //  const dataa = await response.json();
      //  console.log("alldata* ",dataa );
            return await response.json();

        }catch(e){
        console.error("cannot fetching country ",e);
        }

    
}



async function validateInput(){

  errMsg_city.style.display = "none";
  errMsg_date.style.display ="none";

  const city = document.getElementById("city").value;
  const date = document.getElementById("date").value;

  if(!city){
    errMsg_city.innerHTML = "Please insert The City";
    errMsg_city.style.display = "block";
    return;

  }

  if(!date){
    errMsg_date.innerHTML = "Please insert   Date";
    errMsg_date.style.display = "block";
    return;
    
  }
  if(getdays(date)<0){
    errMsg_date.innerHTML = " Invalid  Date ";
    errMsg_date.style.display = "block";
    return;
  }

  errMsg_city.style.display = "none";
  errMsg_date.style.display ="none";
  
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