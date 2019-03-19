const nasaApiKey = 'HpjTy9byKleIItZMcuxJ4WTitnb1NPgsj5tzGsPP';
const url = "https://api.nasa.gov/planetary/apod";

class Person {
	constructor(name, photoUrl, photoTitle, photoDesc, birthDate, email, phone) {
		this.name = name;
		this.photo = { 
			url: photoUrl,
			title: photoTitle,
			desc: photoDesc
		};
		this.birthDate = birthDate;
		this.email = email;
		this.phone = phone
	}
};

//array with objects of Person class
let personsArr = [];

//DOM elements
const form = document.querySelector('#form');
const calendarContainer =  document.querySelector('.calendar-container');
const birthdayListContainer =  document.querySelector('.birthday-list-container');



//-----------------------------------------------------------------------
//---------sample data---------------------------------------------------

personsArr[0] = {
	name: "Rysia",
	photo: {
		url: "https://apod.nasa.gov/apod/image/1803/Cycle-Panel-1024px.jpg",
		title: "Star of the stars",
		desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolorem facilis rerum aspernatur, beatae veritatis debitis magnam ratione praesentium temporibus dicta deleniti, quis, perferendis nesciunt sit. Consectetur pariatur veniam similique."
		},
	birthDate: "2018-08-27",
	email: "rysia@google.com",
	phone: "111 222 333"
};

personsArr[1] = {
	name: "Mina",
	photo: {
		url: "https://apod.nasa.gov/apod/image/1803/Cycle-Panel-1024px.jpg",
		title: "Owner of the biggest Star",
		desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolorem facilis rerum aspernatur, beatae veritatis debitis magnam ratione praesentium temporibus dicta deleniti, quis, perferendis nesciunt sit. Consectetur pariatur veniam similique."
		},
	birthDate: "1982-06-24",
	email: "mina@google.com",
	phone: "111 222 333"
};

personsArr[2] = {
	name: "Anonim",
	photo: {
		url: "https://apod.nasa.gov/apod/image/1803/Cycle-Panel-1024px.jpg",
		title: "Who is that",
		desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolorem facilis rerum aspernatur, beatae veritatis debitis magnam ratione praesentium temporibus dicta deleniti, quis, perferendis nesciunt sit. Consectetur pariatur veniam similique."
		},
	birthDate: "2019-01-05",
	email: "anonim@google.com",
	phone: "111 222 333"
};


//----------------------------------------------------------------------
//------------------- FUNCTIONS ---------------------------------------


//---------------------------------------------------------
//function that returns number of days in a given month and year

function daysInMonth(month, year) {
	//month is 1-indexed, not 0-indexed,
	//because day-0 returns last day of previous month
	return new Date(year, month, 0).getDate();
}


//--------------------------------------------------------------------
//function that creates html structure for calendar
//and displays it

function createCalendar(month, year, container, personsArr) {
	let daysNum = daysInMonth(month, year);
	let daysTable = "";

	for (let i = 1; i <= daysNum; i++) {
		daysTable += `<div class="calendar__day-field" data-day="${i}">${i}</div>`;
	}

	let calendar = `
		<div class="calendar">
			<div class="calendar__header">
				<div class="calendar__month">
					<button class="btn btn--prev-month"><</button>
					<span class="calendar__month-num">${month}</span>
					<button class="btn btn--next-month">></button>
				</div>
				<div class="calendar__year">${year}</div>
			</div>
			<div class="calendar__daysTable">
				${daysTable}
			</div>
		</div>`;
	
	container.innerHTML = calendar;
	updateCalendarWithBirthday(personsArr, month);
}


//-----------------------------------------------------------
// show in calendar info about birthdays of people,
// who were born in currently displayed month

function updateCalendarWithBirthday(personsArr, month) {
	//filter array of persons to select only the ones with birthday 
	//in cuurently displayed month
	let currentMonthBirthdaysArr = personsArr.filter(person => {
		let birthdayMonth = person.birthDate.split("-");
		return parseInt(birthdayMonth[1]) === month;
	});

	//display info about person's birthday in calendar for current month
	currentMonthBirthdaysArr.forEach(person => {
		let dayNum = parseInt(person.birthDate.split('-')[2]);
		let dayEl = document.querySelector(`[data-day="${dayNum}"]`);
		let age = new Date().getFullYear() - parseInt(person.birthDate.split("-")[0]);
		
		dayEl.innerHTML += `
			<div class="calendar__birthday-info">
				<p>${person.name}</p>
				<p>${age} years old</p>
				<p>${person.email}</p>
			</div>
			<a href="#" class="link-modal" data-photoUrl="${person.photo.url}"> </a>`;	//- to make the field clickable
		dayEl.style.backgroundImage = `url(${person.photo.url})`; //put photo retrieved from API in the background of the field
		dayEl.classList.add("calendar__birthday-field");
	});	
}


//------------------------------------------------------------------------------
// request to NASA API to retrieve photo of the day for date passed as parameter
// returns promise 

function getAPOD(url, key, date) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${url}?api_key=${key}&date=${date}`);
		xhr.addEventListener('load', () => {
			//console.log("Wynik polaczenia ", this);
			// if (this.status === 200) {
			// 	resolve(JSON.parse(xhr.responseText));
			// } else {
			// 	reject('An Error occured ' + this.status);
			// }
			resolve(JSON.parse(xhr.responseText));
		});
		xhr.addEventListener('error', () => reject(xhr.statusText));
		xhr.send();
	});
}


//-------------------------------------------------------------
// function that shows modal window
// displays photo, title and description

function showModal(photoUrl, title, desc) {
	let html = `
		<div class="modal">
			<figure>
				<img src="${photoUrl}" alt="nasa-photo">
				<figcaption>
					<h2>${title}</h2>
					<p>${desc}</p>
				</figcaption>
			</figure>
			<button class="btn btn--close-modal">X</button>
		</div>`;
	document.body.insertAdjacentHTML('beforeend',html);
}


//------------------------------------------------------------------
//function that sorts passed array of people by their birthdate
//returns sorted array

function sortByBirthdays(personsArr) {
	personsArr.sort((a, b) => {
		return a['birthDate'].split("-").join("") - b['birthDate'].split("-").join("");
	});
	return personsArr;
}


//--------------------------------------------------------------------------------------
//function that shows list of people's birthdays with a button to edit chosen records

function showBirthdays(personsArr, container) {
	//sort array by birthdays
	let sortedPersonsArr = sortByBirthdays(personsArr);

	if (document.querySelector('.bday-list')) {
		document.querySelector('.bday-list').parentNode.removeChild(document.querySelector('.bday-list'));
	}

	let bdayList = document.createElement("ul");
	bdayList.classList.add("bday-list");
		
	let liElems = "";
	sortedPersonsArr.forEach((person, index) => {
		liElems += `
			<li>
				<div>
					<p><strong class="bday-list__birthdate">${person.birthDate}
					- ${person.name}</strong></p>
					<p>tel. ${person.phone}, ${person.email}</p>
				</div>
				<button class="btn btn--edit" data-editIndex="${index}">Edit</button>	
			</li>
		`;
	});
	bdayList.innerHTML = liElems;
	container.append(bdayList);
	//container.innerHTML = bdayList;
}


//--------------------------------------------------------------------------------------
//show form in order to edit record on birthdays list

function showForm(person, index, container) {
	let form = `
	<form action="#" method="post" id="form-edit" data-index="${index}">
		<div class="form-row">
			<label for="name">Name:</label>
			<input type="text" id="name" name="name" value="${person.name}" required>
		</div>
		<div class="form-row">
			<label for="email">E-mail:</label>
			<input type="email" id="email" name="email" value="${person.email}" required>
		</div>
		<div class="form-row">
			<label for="phone">Phone:</label>
			<input type="text" id="phone" name="phone" value="${person.phone}" required>
		</div>
		<div class="form-row">
			<label for="birthdate">Birth date:</label>
			<input type="date" id="birthdate" name="birthdate" value="${person.birthDate}" required>
		</div>
		<button type="submit" name="submit" class="btn btn--update">Update</button>
	</form> `;
	container.insertAdjacentHTML('afterend', form);
}


//---------------------------------------------------
// reset form and set current date in date field

function resetForm(formEl) {
	let date = new Date();
	let month = date.getMonth() < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
	let currentDate = `${date.getFullYear()}-${month}-${date.getDate()}`;
	formEl.name.value = "";
	formEl.email.value = "";
	formEl.phone.value = "";
	formEl.birthdate.value = currentDate;
	formEl.birthdate.max = currentDate;
}


//---------- inits the app ------------------------------------

function init() {
	//show current calendar
	createCalendar(new Date().getMonth() + 1, new Date().getFullYear(), calendarContainer, personsArr);
	//show birthdays list
	showBirthdays(personsArr, birthdayListContainer);
	resetForm(form);
}




//--------------------------------------------------------------------------------
//---------------------------- EVENT LISTENERS -----------------------------------

// NEXT / PREVIOUS MONTH BUTTONS
//handle clicks for next or previous months
//and show calendar for chosen month
//also handle clicks on field with birthday and open modal window
calendarContainer.addEventListener('click', (e) => {
	let month = parseInt(document.querySelector('.calendar__month-num').textContent);
	let year = parseInt(document.querySelector('.calendar__year').textContent);

	if (e.target.className.includes("btn--next-month")) {
		if ((month >= 1) && (month < 12)) {
			month++;
			createCalendar(month, year, calendarContainer, personsArr);
		}
	} else if (e.target.className.includes("btn--prev-month")) {
		if ((month > 1) && (month <=12)) {
			month--;
			createCalendar(month, year, calendarContainer, personsArr);
		}
	}

	//click on field with someone's birthday
	//- opens full screen modal window with NASA photo, title and description
	if (e.target.className === "link-modal") {
		let photoUrl = e.target.dataset.photourl;
		let photoData = personsArr.find(person => person.photo.url === photoUrl);
		
		//show modal with picture, title and description retrieved from API
		showModal(photoUrl, photoData.photo.title, photoData.photo.desc);
	}
});


// FORM SUBMIT
//handle submitting birthdays and other info about a person
form.addEventListener('submit', (e) => {
	e.preventDefault();
	console.log('submit clicked');
	let name = form.name.value;
	let email = form.email.value;
	let phone = form.phone.value;
	let birthDate = form.birthdate.value;
	//date needed to retrieve astronomy picture of the day
	let dateForAPOD = `${new Date().getFullYear()-1}-${birthDate.split("-")[1]}-${birthDate.split("-")[2]}`;

	//request information from NASA API, returns Promise
	//then puts retrieved info in array along with info about person
	let photo = getAPOD(url, nasaApiKey, dateForAPOD)
	.then(resp => {
		let photoUrl = resp.url;
		let photoTitle = resp.title;
		let photoDesc = resp.explanation;
		let personObj = new Person(name, photoUrl, photoTitle, photoDesc, birthDate, email, phone);
		personsArr.push(personObj);
		console.log(personObj);

		createCalendar(new Date().getMonth() + 1, new Date().getFullYear(), calendarContainer, personsArr);

		//updateCalendarWithBirthday(personsArr, birthDate.split("-")[1]);
		window.scroll(0, 0);
		resetForm(form);
		
	})
	.catch(error => console.log(error));
	
});


//modal window - CLOSE BUTTON
//listen for clicks to close modal window with photo from nasa
document.body.addEventListener('click', e => {
	if (e.target.className.includes("btn--close-modal")) {
		let modalEl = e.target.parentNode;
		document.body.removeChild(modalEl);
	}
});


// handle EDIT BUTTONS
birthdayListContainer.addEventListener('click', (e) => {
	let index;
	if (e.target.classList.contains('btn--edit')) {
		index = parseInt(e.target.dataset.editindex);
		//show form to update info
		showForm(personsArr[index], index, e.target);
		e.target.textContent = "Close";
		e.target.classList.replace("btn--edit", "btn--edit-close");
	} else if (e.target.classList.contains('btn--edit-close')) {
		//hide form
		const editForm = document.querySelector("#form-edit");
		editForm.parentNode.removeChild(editForm); 
		e.target.textContent = "Edit";
		e.target.classList.replace("btn--edit-close", "btn--edit");
	} else if (e.target.classList.contains("btn--update")) {
		e.preventDefault();
		console.log("update btn clicked");
		console.log(e);
		const editForm = e.target.parentNode;
		index = parseInt(editForm.dataset.index);
		console.log(editForm);
		console.log(index);
		personsArr[index].name = editForm.name.value;
		personsArr[index].email = editForm.email.value;
		personsArr[index].phone = editForm.phone.value;
		//if datebirth is different than previously submitted
		//then a request to API is made to retrieve new photo
		if (personsArr[index].birthDate !== editForm.birthdate.value) {
			personsArr[index].birthDate = editForm.birthdate.value;
			let photo = getAPOD(url, nasaApiKey, dateForAPOD)
			.then(resp => {
				personsArr[index].photo.url = resp.url;
				personsArr[index].photo.title = resp.title;
				personsArr[index].photo.desc = resp.explanation;
			})
			.catch(error => console.log(error));
		}
		console.log("Updated array of objects");
		console.log(personsArr);
		createCalendar(new Date().getMonth() + 1, new Date().getFullYear(), calendarContainer, personsArr);
		showBirthdays(personsArr, birthdayListContainer);
	}
});



init();