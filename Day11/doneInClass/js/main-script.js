$('html').attr('class', 'js');
const nav = $('.main-nav'); 
let topOfNav = nav.position().top;
let heightOfNav = nav.height();
let clicked = 0; 

const theBod = $('body'); //stores the body element

let lastId,
	menuItems = nav.find('a'),
	scrollItems = menuItems.map( function(){
			let item = $($(this).attr('href'));
			if(item.length){ return item } 
	})

//console.log(scrollItems);

function fixNav(){

	if($(window).scrollTop() >= topOfNav ){
		theBod.addClass('fixed-nav');
	}else{
		theBod.removeClass('fixed-nav');
	}

    //added to fixed nav: from https://codepen.io/joxmar/pen/NqqMEg
    //to highlight sticky nav elements

	let fromTop = $(this).scrollTop()+heightOfNav;

	//get id of current scroll item
	let cur = scrollItems.map( function(){
			if($(this).offset().top < fromTop+1){
				return this;
			}
	})

	cur = cur[cur.length-1];
	//ternary operator syntax
	let id = cur && cur.length ? cur[0].id : "";
	//regular if
	if(lastId !== id){
		lastId = id;
		//set/remove active class
		$('.main-nav .active').removeClass('active');
		//trying simpler syntax
		let selector = `[href="#${id}"]`;
		//console.log(selector, '[href="#'+id+'"]' )
		$(selector).addClass('active');
	} 

}//end fixNav

//nav anchor click function:

$('.main-nav li a').on('click', function(e){
	clicked++;
console.log(clicked);

	if(this.hash !== ''){
		e.preventDefault(); //prevents anchor from jumping to id
		//store the hash value:
		let hash = this.hash; 

		let winTop = $(window).scrollTop(); //tells us where the window is before we animate

		let hashPageY = $(hash).offset().top;
		let menuOffset = nav.height();

		if(winTop < hashPageY){

			if(hashPageY > topOfNav){
				hashPageY-=menuOffset;
				if(clicked == 1 && $('body.fixed-nav').length == 0){
					hashPageY-=menuOffset;

				}
			}

		}else{

			if(hashPageY > topOfNav){
				hashPageY-=menuOffset;
			}else{
				clicked = 0;
			}
		} //end if/else winTop < hashPageY

		let bodAnimate = 0;

		$('html, body').animate({
			scrollTop:(hashPageY)
		}, 800, function(){
			if(bodAnimate == 0){
				//run animation
				bodAnimate++;
				//grabs pure url without hash tag
				let winStripHash = (window.location.href).split('#')[0]
				history.pushState((winStripHash), $('title').text(), winStripHash+hash)
			}
		})


	}//end if hash

}) //end click on a

//handler when the page and its content is fully loaded does go to the right place:
$(window).on('load', function(){
	//this gets when the images have also been loaded
	clicked = 0;
	//gets the url of the window and splits it at the hash tag

	let url = (window.location.href).split('#'); //url is an array of 2 items

	if(url[1] != ''){
		//if the second value of the array is not empty
		$('.main-nav li a').each( function(){
			let href = $(this).attr('href').split('#')[1]
			if (url[1] == href){

				$(this).trigger('click');
			}

		})
	}



})


//event listener
$(window).on('scroll', fixNav);