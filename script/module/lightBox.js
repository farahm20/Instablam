const galleryItems = document.querySelector("#gallery").children;
const lightBoxContainer = document.querySelector(".lightBox");
const lightBoxImage = document.querySelector(".lightBoxImage");
let index;
let imageSrc;


//******LightBOX event listener added to all the images recived from flickr api
export function addClickToImages(){
    console.log('works')
    for(let i = 0; i < galleryItems.length ; i++){
        console.log("For loop: all gallery Items " + galleryItems[i]);
        galleryItems[i].addEventListener("click", function(){
            console.log(i);
            index = i;

            selectImageforLightBox();
            lightBox();
        })
    }
}

//*******LightBOX will close if clicked outside the picture or on x
lightBoxContainer.addEventListener("click", function(event){
    if(event.target !== lightBoxImage){
        lightBox();
    }
})

//*******LightBOX: selects the picture to show in lightbox.
export function lightBox(){
    console.log("In teh lightbox function" + lightBoxContainer);
    lightBoxContainer.classList.toggle("open");
}

//*******LightBOX: this will select images to appear in the lightbox. 
export function selectImageforLightBox () {
    console.log(galleryItems[index])
    imageSrc = galleryItems[index].querySelector("img").getAttribute("src");
    console.log("In the selectImageforLightBox function " + imageSrc);
    lightBoxImage.src = imageSrc;
}