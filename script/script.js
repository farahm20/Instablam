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

function cameraSettings() {
    const errorMessage = document.querySelector('.video > .error');
    const showVideoButton = document.querySelector('.video .start-stream');
    const stopButton = document.querySelector('.video .stop-stream');
    const photoButton = document.querySelector('.profile button');

    const profilePic = document.querySelector('.profile > img');
    const facingButton = document.querySelector('.profile .change-facing');



    let stream;
    let facing = 'environment';

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
        //    profilePic.src = imgUrl;
        //    profilePic.classList.remove('hidden');


        gallery.innerHTML += `<section class = "image Card">
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

    })

}



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

async function getAddressFromPosition(lat, lng, onSuccess) {
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

function notificationSettings() {
    let notificationsPermission = 'default';
    const askPermissionButton = document.querySelector('#askPermissionButton');
    askPermissionButton.addEventListener('click', async () => {
        const answer = await Notification.requestPermission();
        notificationsPermission = answer;
        if (answer == 'granted') {
            console.log('Notification: permission granted, user allowed notifications');
        } else if (answer == 'denied') {
            console.log('Notification: user denied notifications');
        } else {
            console.log('Notification: user declined to answer');
        }
    })
}
