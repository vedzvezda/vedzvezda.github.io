const dateOfBirth = document.getElementById('dateOfBirth');
const dateMain = document.getElementById('date');
// day

const daySlct = document.createElement('select');
daySlct.name = daySlct.id = 'day';
daySlct.width = '50px';

for (let i = 1; i <= 31; i++){

	let optn = document.createElement('option');
	optn.value = optn.innerHTML = i;
	daySlct.appendChild(optn);
} 

dateOfBirth.appendChild(daySlct);

//  month

const monthSlct = document.createElement('select');
monthSlct.name = monthSlct.id = 'month';
monthSlct.width = '50px';

let months = {
	1: 'Январь',
	2: 'Февраль',
	3: 'Март',
	4: 'Апрель',
	5: 'Май',
	6: 'Июнь',
	7: 'Июль',
	8: 'Август',
	9: 'Сентябрь',
	10: 'Октябрь',
	11: 'Ноябрь',
	12: 'Декабрь'
}

for (let month in months){

	let optn = document.createElement('option');
	[optn.value, optn.innerHTML] = [month, months[month]] ;
	monthSlct.appendChild(optn);
} 

dateOfBirth.appendChild(monthSlct);

// year

const yearSlct = document.createElement('select');
yearSlct.name = yearSlct.id = 'year';
yearSlct.width = '50px';

let now = new Date();
let currentYear = now.getFullYear();

for (let i = currentYear; i >= 1941; i--){

	let optn = document.createElement('option');
	optn.value = optn.innerHTML = i;
	yearSlct.appendChild(optn);
} 

dateOfBirth.appendChild(yearSlct);

function getDateOfBirth(){
	
	let day = document.getElementById('day').value;
	let month = document.getElementById('month').value;
	let year = document.getElementById('year').value;
	
	showInfo(`${year}-${month}-${day}`);
	
}


const info = document.getElementById('info');
let infoTxt = document.getElementById('infoTxt');
let nxt = document.getElementById('animate-flicker');

async function getInfo(date) {
    const response = await fetch(`https://school-of-healing.ru/astrology/api.php?date=${date}`);
    return response.json();
}

function showInfo(date) {

    getInfo(date).then(res => {
		if(res.error){
			info.style.display = `flex`;
			infoTxt.innerHTML = res.error;
			infoTxt.innerHTML += `<img src='./images/shrug.png' width='8%'>`;
		} 
		else {
			console.log(res);
			load(res, date);
		}
	});
}

function load(res, date) {
	
	let dateToStr = date.split('-');
	let y = dateToStr[0];
	let m = dateToStr[1];
	let d = dateToStr[2];

	let mmm;

	switch(m){
		case '3':
		case '8':
			mmm =`${months[m]}а`;
		break;
		default: 
			mmm = `${months[m].slice(0,-1)}я`;
		break;

	}
	dateMain.innerHTML = ``;

	info.style.display = `flex`;

	//infoTxt.innerHTML = `<div class="loader"></div>`;
	infoTxt.classList.toggle('fontSize');
	infoTxt.innerHTML = `<div style='display: flex; align-items: baseline; '>И так ${d} ${mmm} ${y} года <div class="la-ball-pulse la-dark la-sm">/n
   														 <div></div><div></div><div></div></div></div>`;

	new Promise(resolve => setTimeout(() => resolve(), 4000))
	.then(() => {
		let l = '';
		dateMain.innerHTML = `${d} ${mmm} ${y} года`;
		switch(res.planetWeekday){
			case '3':
			case '5':
			case '6':
				l = 'а';
			break;
			case '7':
				l = 'о';
			break;
		}
		
		infoTxt.classList.toggle('typewriter');
		infoTxt.innerHTML = `Это был${l} ${res.planetWeekdayName.toLowerCase()}`;

		
		return new Promise(resolve => {
			infoTxt.addEventListener('animationend', () => {
				infoTxt.classList.toggle('typewriter');
				
				let infoTxtNew = infoTxt.cloneNode(false);
				info.replaceChild(infoTxtNew, infoTxt);

				infoTxt = infoTxtNew;
				
				return resolve();
			});
		});
 
	})
	.then(() => {
		
			let planet = '';
			switch(res.planetWeekday){
				case '1':
					planet = `${res.planet.slice(0,-1)}ы`;
				break;
				case '2':
					planet = `${res.planet}а`;
				break;
				case '3':
					planet = `${res.planet.slice(0,-1)}я`;
				break;
				case '4':
					planet = `${res.planet}а`;
				break;
				case '5':
					planet = `${res.planet.slice(0,-1)}ы`;
				break;
				case '6':
					planet = `${res.planet}а`;
				break;
				case '7':
					planet = `${res.planet.slice(0,-1)}а`;
				break;
			}
			
			infoTxt.classList.toggle('typewriter');
			infoTxt.innerHTML = `${res.planetWeekdayName} - день ${planet}`;

			return new Promise(resolve => {
				infoTxt.addEventListener('animationend', () => {
					infoTxt.classList.toggle('typewriter');
					infoTxt.classList.toggle('fontFmly');
					let infoTxtNew = infoTxt.cloneNode(false);
					info.replaceChild(infoTxtNew, infoTxt);
					infoTxt = infoTxtNew;
					return resolve([planet, res.planetImg]);
				});
	
			});
		})
		.then((v) => {
			infoTxt.classList.toggle('infoTxtDsc');
			infoTxt.innerHTML =`<h2>Характеристики рождённых в день ${v[0]}</h2> ${res.planetDsc}`;
			info.style.backgroundImage = `url(${v[1]})`;
			nxt.innerHTML = `Идём дальше...`;
			nxt.setAttribute(`value`, `animal`); 
			nxt.addEventListener('click', (e) => {
				let val = e.target.getAttribute(`value`);
				return next(val, res);
			});
		});
	

}


function next(v, res) {

	switch(v){
		case 'animal':

			new Promise(resolve => setTimeout(() => resolve(), 100))
				.then(() => {

					let animal = '';
					let animalLoaderDiv = document.createElement('div');
					animalLoaderDiv.id = `animalLoader`;
					info.style.backgroundImage = ``;
					info.style.justifyContent = `flex-start`;
					info.insertBefore(animalLoaderDiv, info.childNodes[0]);
					nxt.innerHTML = ``;
					infoTxt.innerHTML = ``;		
					
					let anim = animalLoaderDiv.animate([
						{ transform: `rotate(${res.animalDgr}deg)` }, 
						{ transform: `rotate(${+res.animalDgr+360}deg)` }
					  ], {
						duration: 5000,
						iterations: 1,
						fill: `forwards`
					  })

					  return new Promise(resolve => {
							anim.onfinish = () => {
								info.style.backgroundImage = ``;
								infoTxt.classList.toggle('infoTxtDsc');
						
								switch(res.animal){
									case 'Змея':
									case 'Лошадь':
									case 'Собака':
									case 'Свинья':
										animal = `${res.animal.slice(0,-1)}и`;
									break;
									case 'Коза':
									case 'Обезьяна':
									case 'Крыса':
										animal = `${res.animal.slice(0,-1)}ы`;
									break;
									default:
										animal = `${res.animal}а`;
									break;
								}
								let txt = `Был год ${animal.toLocaleLowerCase()}.<br><br>`;
								txt += `Особая черта - ${res.animalPwr.toLocaleLowerCase()}.`;
								return resolve(txt);
							};
						});
				})
				.then((txt) => {
					infoTxt.classList.toggle('fontSize');
					infoTxt.innerHTML = txt;
					return new Promise(resolve => {
						setTimeout(() => {
							return resolve(res.animalDsc);
						},4000);
					});

				})
				.then((dsc) => {
					infoTxt.classList.toggle('infoTxtAnimalDsc');
					infoTxt.innerHTML = dsc;
					let nxtNew = nxt.cloneNode(false);
					document.body.replaceChild(nxtNew, nxt);
					nxt = nxtNew;
					nxt.innerHTML = `Идём дальше...`;
					nxt.setAttribute(`value`, `zodiac`); 
					nxt.addEventListener('click', (e) => {
						let val = e.target.getAttribute(`value`);
						return next(val, res);
					});



				});
	break;

	case 'zodiac':

		new Promise(resolve => setTimeout(() => resolve(), 100))
		.then(() => {
			document.getElementById('animalLoader').remove();
			let zodiacLoaderDiv = document.createElement('div');
			zodiacLoaderDiv.id = `zodiacLoader`;
			info.style.backgroundImage = ``;
			info.style.justifyContent = `flex-end`;
			info.appendChild(zodiacLoaderDiv);
			nxt.innerHTML = ``;
			infoTxt.innerHTML = ``;
			infoTxt.classList.toggle('infoTxtAnimalDsc');
			infoTxt.classList.toggle('infoTxtDsc');
			
			let anim = zodiacLoaderDiv.animate([
				{ transform: `rotate(${res.zodiacDgr}deg)` }, 
				{ transform: `rotate(${res.zodiacDgr+360}deg)` }
			  ], {
				duration: 5000,
				iterations: 1,
				fill: `forwards`
			  })

			  return new Promise(resolve => {
					anim.onfinish = () => {
					info.style.backgroundImage = ``;
					infoTxt.classList.toggle('infoTxtDsc');
					let txt = `Ты  - ${res.zodiac}.<br>`;
					return resolve(txt);
				};
					
					
						
					});
		})
		.then((txt) => {
			
			infoTxt.style.fontSize = '30px';
			infoTxt.innerHTML = txt;

		
			return new Promise(resolve => {
				setTimeout(() => {
					return resolve(res.zodiacDsc);
				},3000);
			});

		})
		.then((dsc) => {
			infoTxt.classList.toggle('infoTxtZodiacDsc');
			infoTxt.innerHTML = dsc;
		});

				
	break;


	}

}
