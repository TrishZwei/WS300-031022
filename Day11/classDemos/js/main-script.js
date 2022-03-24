 //starting with jQuery.... 
 $('html').removeClass('no-js').addClass('js');

 const nav = $('.main-nav'); //const cannot be redeclared or reassigned a new value. It will ALWAYS be nav

 let topOfNav = nav.position().top; //holds the top position of our nav
 let heightOfNav = nav.height();
 const theBod = $('body'); //stores the body element

 //my stickyNav function
 //let addedClass;

//highlight nav element found here: https://codepen.io/joxmar/pen/NqqMEg
    //converted to jQ3

    let lastId, 
        //topMenuHeight =  is the same as heightOfNav varible already in code
        menuItems = nav.find('a'),
        scrollItems = menuItems.map( function(){
          let item = $($(this).attr('href'));
          if (item.length) { return item}
        })

//removed the click function from the code due to our own click function working like it should

 function fixNav(){
  console.log('fixNav');  

    if($(window).scrollTop() >= topOfNav){
      theBod.addClass('fixed-nav');

    }else{
      theBod.removeClass('fixed-nav');
    }

    //added to fixed nav: from https://codepen.io/joxmar/pen/NqqMEg
    //to highlight sticky nav elements
    var fromTop = $(this).scrollTop()+heightOfNav;
    
   // Get id of current scroll item
   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop+1)
       return this;
   });
   
   cur = cur[cur.length-1];
   console.log(cur);
   var id = cur && cur.length ? cur[0].id : "";
   console.log(lastId, id);
   if (lastId !== id) {
       lastId = id;
       // Set/remove active class
       $('.main-nav .active').removeClass('active');
       $('[href="#'+id+'"]').addClass('active');
   }                   
  }

$(window).on('scroll', fixNav);

$(window).on('resize', function(){
  console.log('resize')
  //because resize makes a difference in everything...
  topOfNav = nav.position().top;
  heightOfNav = nav.height();
  $(window).trigger('scroll');
})

let clicked = 0;

$('.main-nav li a').on('click', function(event){
 
    clicked++;
    console.log(clicked);

    if(this.hash !== ''){
      event.preventDefault(); //prevents a tag from jumping up immediately
      //store the hash
      let hash = this.hash; //gets the value of the hash clicked

      let winTop = $(window).scrollTop(); //tells us where the position of the window is... before animating

      let hashPageY = $(hash).offset().top;
      let menuOffset = $('.main-nav').height();

      if(winTop < hashPageY){
        // console.log('we are going down');
        // console.log('added class is:', addedClass)      
        if(hashPageY > topOfNav){
          // console.log('we should see the stickyNav');
          // console.log('added class is:', addedClass)
          hashPageY-=menuOffset;
          if(clicked == 1 && $('body.fixed-nav').length == 0){
           hashPageY-=menuOffset; //adding the offset again as when it comes from the top of the page from the menu... that menu got taken out of the flow and effected the position of all the elements that followed after. 
          }
        }else{
          console.log('we should see the nav go away.')
        }

      }else{
        console.log('we are going up');
        if(hashPageY > topOfNav){
          console.log('we should see the stickyNav');
          hashPageY-=menuOffset;
        }else{
          console.log('we should see the nav go away.')
          clicked = 0; //reset the value of clicked.
        }

      }


      //using jQ's animate mthod to add smooth page scroll

      let bodAnimate = 0;
      //what is the current value of the scrollTop?
      

      $('html, body').animate({
        scrollTop:(hashPageY)
      }, 800, function(){
        //this is getting called twice due to being called on HTML AND body the following code ensures that the code gets run only once:
        if(bodAnimate == 0){
          //run animation
          bodAnimate++;
          //gets the fist part of the array which is the location of the window without the #
          let winStripHash = (window.location.href).split('#')[0];

          //changes URL without refresh and marks it in the browser history
          history.pushState((winStripHash), $('title').text(), winStripHash+hash);

        }

      })

    } //end if hash ''

})

//code for when we are navigating directly to the #anchor

// Handler when the page and its content is fully loaded. This may delay your function a bit... but it does go to the right place
$(window).on( 'load', function(){
//this gets when the images have also been loaded 
//so that the page knows where the actual position is

  clicked = 0;

//gets the url of the window and splits it at the hashtag
  let url = (window.location.href).split('#');
  //url has now become a two item array.
 
  if(url[1] != ''){
 //if the second value in the url array is not empty....
    $('.main-nav li a').each( function(){
      //find which item in the links match

     let href = $(this).attr('href').split('#')[1];

     if(url[1] == href){
      //trigger the anchor tag that matches after the #.
      $(this).trigger('click');
     }

    })
  }
})
