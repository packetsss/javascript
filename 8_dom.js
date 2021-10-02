// Document Object Model 

// Single Element Selectors
console.log(document.getElementById('my-form'));
console.log(document.querySelector('.container'));

// Multiple Element Selectors
console.log(document.querySelectorAll('.item')); // select entire class
console.log(document.getElementsByTagName('li'));
console.log(document.getElementsByClassName('item'));

// log all in item class
document.querySelectorAll('.item').forEach((item) => console.log(item));


// MANIPULATING THE DOM
const ul = document.querySelector('.items');

// remove elements
/*
ul.remove();
ul.lastElementChild.remove();
*/

// change contents
ul.firstElementChild.textContent = 'Hello';
ul.children[1].innerText = 'Brad';
ul.lastElementChild.innerHTML = '<h1>Hello</h1>';

// change button style
const btn = document.querySelector('.btn')
btn.style.background = 'red';


// EVENTS
// Mouse Event
btn.addEventListener('click', e => {
  e.preventDefault(); // prevent refreshing page
  console.log(e.target.className);

  document.getElementById('my-form').style.background = '#ccc';
  document.querySelector('body').classList.add('bg-dark');
  ul.lastElementChild.innerHTML = '<h1>Changed</h1>';
});

// Keyboard Event
const nameInput = document.querySelector('#name');
nameInput.addEventListener('input', e => { // on change
  document.querySelector('.container').append(nameInput.value);
});


// USER FORM SCRIPT
// Put DOM elements into variables
const myForm = document.querySelector('#my-form');
const emailInput = document.querySelector('#email');
// const nameInput = document.querySelector('#name');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');

// Listen for form submit
myForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  
  if(nameInput.value === '' || emailInput.value === '') {
    alert('Please enter all fields');
    msg.classList.add('error');
    msg.innerHTML = 'Please enter all fields';

    // Remove error after 3 seconds
    setTimeout(() => msg.remove(), 3000);
  } else {
    // Create new list item with user
    const li = document.createElement('li');

    // Add text node with input values
    li.appendChild(document.createTextNode(`${nameInput.value}: ${emailInput.value}`));

    // Add HTML
    li.innerHTML = `<strong>${nameInput.value}</strong>e: ${emailInput.value}`;

    // Append to ul
    userList.appendChild(li);

    // Clear fields
    nameInput.value = '';
    emailInput.value = '';
  }
}
