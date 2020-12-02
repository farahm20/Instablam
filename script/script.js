import { addClickToImages, lightBox, selectImageforLightBox } from './module/lightBox.js';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => {
            console.log('Service worker registered.');
        })
}
let city;
let country;
// async function allowCamera() {
//     if('mediaDevices' in navigator) {
//         const md = navigator.mediaDevices;
//         let stream = await md.getUserMedia({
//             audio: false,
//             video: true
//         });
//     }
// }
// allowCamera();

window.addEventListener('load', () => {
    if ('mediaDevices' in navigator) {
        cameraSettings();
    }
    if ('geolocation' in navigator) {
        locationSettings();
    }
    notificationSettings();
})

//turns on stream, allows taking photos and printing in html
function cameraSettings() {
    const errorMessage = document.querySelector('.video > .error');
    const showVideoButton = document.querySelector('.video .start-stream');
    const stopButton = document.querySelector('.video .stop-stream');
    const photoButton = document.querySelector('.profile button');

    const facingButton = document.querySelector('.profile .change-facing');

    let stream;
    let facing = 'environment';

    getStoredImages();
    //start video stream
    showVideoButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        try {
            const md = navigator.mediaDevices;
            stream = await md.getUserMedia({
                video: { width: 320, height: 320, facingMode: facing }
            })

            const video = document.querySelector('.video > video');
            video.srcObject = stream;
            stopButton.disabled = false;
            photoButton.disabled = false;
            showVideoButton.disabled = true;
        } catch (e) {
            errorMessage.innerHTML = 'Could not show camera window.';
        }
    })

    //stop video stream
    stopButton.addEventListener('click', () => {
        errorMessage.innerHTML = '';
        if (!stream) {
            errorMessage.innerHTML = 'Camera turned off.';
            return;
        }
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stopButton.disabled = true;
        photoButton.disabled = true;
        showVideoButton.disabled = false;
    })

    //camera direction
    facingButton.addEventListener('click', () => {
        if (facing == 'environment') {
            facing = 'user';
            //    facingButton.innerHTML = 'Show user';
        }
        else {
            facing = 'environment';
            //    facingButton.innerHTML = 'Show environment';
        }
        stopButton.click();
        showVideoButton.click();
    })
    
    //takes photo and creates a card with location in html
    photoButton.addEventListener('click', async () => {
        errorMessage.innerHTML = '';
        if (!stream) {
            errorMessage.innerHTML = 'Cannot take photo. Camera is off.';
            return;
        }

        let tracks = stream.getTracks();
        let videoTrack = tracks[0];
        let capture = new ImageCapture(videoTrack);
        let blob = await capture.takePhoto();

        let imgUrl = URL.createObjectURL(blob);

        //prints every photo taken on page
        gallery.innerHTML += `<section class = "photo card">
                                        <img class = "photoTaken" src="${imgUrl}" alt="">
                                        <article class = "photoLocation">
                                            <p>City: ${city}</p>
                                            <p>Country: ${country}</p> 
                                        </article>
                                    
                                        <button><a href="${imgUrl}" download class="downloadPhoto hidden"> Download photo</a></button>
                                        <button class = "deletePhoto"> Delete </button>
                                        </section>`;

        const downloadPhoto = document.querySelector(".downloadPhoto");
        downloadPhoto.classList.remove('hidden');
        downloadPhoto.download = "instaPhoto.jpeg";

        let deletPhotoButton = document.querySelectorAll(".deletePhoto");
        deletPhotoButton.forEach((element) =>
            element.addEventListener("click", () => {
                element.parentElement.remove();
            })

        );
        

        notificationSettings();
    })

}

//take static images from Gallery and prints them in html.
function getStoredImages(){
    let storedImages = [
        {
            imgUrl: 'aurora.jpg',
            city: 'Solheimasandur',
            country: 'Iceland'
        },
        {
            imgUrl: 'night.jpg',
            city: 'Alberta',
            country: 'Canada',
        },
        {
            imgUrl: 'orange.jpg',
            city: 'Alberta',
            country: 'Canada',
        }
    ];

    for(let i=0; i<storedImages.length; i++){
    //  console.log("in for loop" + storedImages[i].city + " "+ i);
         gallery.innerHTML += `<section class = "photo card">
                                        <img class = "photoTaken" src="images/${storedImages[i].imgUrl}" alt="">
                                        <article class = "photoLocation">
                                            <p>City: ${storedImages[i].city}</p>
                                            <p>Country: ${storedImages[i].country}</p> 
                                        </article>
                                    
                                        <button><a href="${storedImages[i].imgUrl}" download class="downloadPhoto hidden"> Download photo</a></button>
                                        <button class = "deletePhoto"> Delete </button>
                                        </section>`;

        let downloadPhotos = document.querySelectorAll(".downloadPhoto");
       //takes the index i from for loop.
        downloadPhotos.forEach((downloadPhoto, i) => {
            downloadPhoto.classList.remove('hidden');
            downloadPhoto.href = "images/" + storedImages[i].imgUrl;
            // console.log("printing href: "+downloadPhoto.href)
            downloadPhoto.download = "instaPhoto.jpg";
        })
    
      
        // let url = storedImages[i].imageUrl;
       

        let deletPhotoButton = document.querySelectorAll(".deletePhoto");
        deletPhotoButton.forEach((element) =>
            element.addEventListener("click", () => {
                element.parentElement.remove();
            })

        );
    }
}

//getting latitute and longitute
function locationSettings() {
    try {
        const geo = navigator.geolocation;
        geo.getCurrentPosition(pos => {
            let lat = pos.coords.latitude;
            let lng = pos.coords.longitude;
            // message.innerHTML = `You are at ${lat}, ${lng}.`;
            getAddressFromPosition(lat, lng);
        }, error => {
            console.log(error);
        });
    } catch (e) {
        console.log('Access denied from Geolocation API.');
    }

}

//getting address form geo API
async function getAddressFromPosition(lat, lng) {
    const message = document.querySelector('.position');

    try {
        const response = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
        const data = await response.json();
        console.log('Address: ', data)
        if (data.error) {
            message.innerHTML += `<br> Can not get location at this time. Please try again later.`;
        } else {
            city = data.city;
            country = data.country;
            console.log(city, " + ", country);
        }
    } catch (e) {
        console.log(e)
    }
}

// noitifications 
function notificationSettings() {
    let notificationsPermission = false;
    const askPermissionButton = document.querySelector('#askPermissionButton');
    askPermissionButton.addEventListener('click', async () => {
        const answer = await Notification.requestPermission();
        notificationsPermission = true;
        if (answer == 'granted') {
            console.log('Notification: permission granted, user allowed notifications');
        } else if (answer == 'denied') {
            console.log('Notification: user denied notifications');
        } else {
            console.log('Notification: user declined to answer');
        }
    })

    showNotificationButton.addEventListener('click', () => {
        if(!notificationsPermission) {
            console.log('Notification permission not granted!');
            return;
        }

        const options = {
            body: "Welcome to Instablam :) ",
            icon: '../images/camera_icon-512.png'
        }
        let notif = new Notification('Reminder', options);
        notif.addEventListener('show', () => {
            console.log('Showing notification');
        })
        notif.addEventListener('click', () => {
            console.log('User clicked on notification');
        })
    })
}
