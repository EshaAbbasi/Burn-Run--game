let nameplay='';


const submit=document.getElementById('.submitNameButton');
const inputContainer=document.querySelector('input-container');
const start=document.getElementById('#startButton');
const name=document.getElementById('playerName');
const easy=document.querySelector('#level1');
const hard=document.querySelector('#level2')
const msg=document.getElementById('message');


startButton.addEventListener('click', () => {
    console.log("work");
    //inputContainer.style.display ='block';
    
    submitNameButton.style.display ='none';
    
    
});
 submitNameButton.addEventListener('click', () => {
               nameplay=playerName.value.trim();
    //display.textContent = `Welcome to Burn & Run, ${playerName.value.trim()}!`;
    if (nameplay=== '') 
    {
        message.textContent = 'Please enter your name.';
       
    }
    else 
     {
        message.textContent = `Welcome to Burn & Run, ${nameplay}!`;
        
    }
});
level1Button.addEventListener('click', () => {
    begin(nameplay,'easy');
});
level2Button.addEventListener('click', () => {
    begin(nameplay,'hard');
});
function begin(name,level){
    message.textContent = ` ${name}! You have selected ${level} level.`;
}
