import {addClickToImages, lightBox, selectImageforLightBox} from './module/lightBox.js';

if( 'serviceWorker' in navigator ) {
    navigator.serviceWorker.register('sw.js')
    .then(reg => {
        console.log('Service worker registered.');
    })
}

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
    if('mediaDevices' in navigator){
        cameraSettings();
    }
})

function cameraSettings() {
    const errorMessage = document.querySelector('.video > .error');
    const showVideoButton = document.querySelector('.video .start-stream');
    const stopButton = document.querySelector('.video .stop-stream');
    const photoButton = document.querySelector('.profile button');

    const profilePic = document.querySelector('.profile > img');
    const facingButton = document.querySelector('.profile .change-facing');
    
    const downloadLink = document.querySelector('.gallery .downloadLink');

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
        if( !stream ) {
            errorMessage.innerHTML = 'Camera turned off.';
            return;
        }
        // hur stoppa strömmen? Kolla dokumentationen
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stopButton.disabled = true;
        photoButton.disabled = true;
        showVideoButton.disabled = false;
    })

    facingButton.addEventListener('click', () => {
        if( facing == 'environment' ) {
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
        if( !stream ) {
            errorMessage.innerHTML = 'Cannot take photo. Camera is off.';
            return;
        }
        
        let tracks = stream.getTracks();
        let videoTrack = tracks[0];
        let capture = new ImageCapture(videoTrack);
        let blob = await capture.takePhoto();

        let imgUrl = URL.createObjectURL(blob);
        profilePic.src = imgUrl;
        profilePic.classList.remove('hidden');

    
        downloadLink.href = imgUrl;
        downloadLink.classList.remove('hidden');
        downloadLink.download = 'capture';

        let index = 0;
        const images = new Array();
        images[index] = profilePic;
       
       // showImagesInHtml(images); 

        let sendAsOutput = document.getElementById("gallery");
        sendAsOutput.innerHTML = '';
        var img = document.createElement('img');
     //   img.src = profilePic.src;
        img.src = images[index].src;
        let galleryDiv = document.createElement('div')
        galleryDiv.appendChild(img);
        gallery.appendChild(galleryDiv);
        index++;
         
    })
}

function showImagesInHtml(images) {

    //  console.log("In the show images in HTML function");
        let sendAsOutput = document.getElementById("gallery");
        sendAsOutput.innerHTML = '';
       
        
        images.forEach(element => {
            var img = new image();
            img.src = element.src;
            let galleryDiv = document.createElement('div')
            galleryDiv.appendChild(img);
            gallery.appendChild(galleryDiv); 
        });
    
        addClickToImages();
    }

//     function GFG_Fun() { 
//         var img = new Image(); 
//         img.src =  
// 'https://media.geeksforgeeks.org/wp-content/uploads/20190529122828/bs21.png'; 
//         document.getElementById('body').appendChild(img); 
//         down.innerHTML = "Image Element Added.";  
//     }  