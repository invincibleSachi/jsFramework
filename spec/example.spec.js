describe('Main Method 1', ()=> {

    describe('Function 1', () =>{

     beforeAll(function() {
         console.log('Start of Function 1');
     });

     beforeEach(function() {
         console.log('Start of next test');
     });

     afterAll(function() {
         console.log('End of Function 1');
     });

     it('Function 1.1',()=>{
         OpenPage();
     });

     it('Function 1.2',()=>{
         console.log('Function 1.2');
     });
  });

    describe('Function 2', ()=> {

     beforeAll(function() {
         console.log('Start of Function 2');
     });

     it('Function 2.1',()=>{
         OpenPage();
     });

     it('Function 2.2',()=>{
         console.log('Function 2.2');
     });
  });
});

function OpenPage() {
    // open page 
    browser.get('http://google.com/');
    // More code you don't want to repeat.
}