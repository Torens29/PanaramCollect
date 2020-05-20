let selectTypeOfZone;

let activeZones = document.querySelector('.activeZones');
let i=0;
let BtnAddActiveZone = document.querySelector('.addActiveZone');
let BtnRemoveActiveZone = document.querySelector('.removeActiveZone');

BtnAddActiveZone.addEventListener('click', () => {
    i++;
    let divRGB = document.createElement('div');
    divRGB.className = 'divRGB';
    divRGB.id= `divRGB${i}`;
    divRGB.innerHTML= `
        <abbr title="Red color">R = </abbr><input type="number" value="0" min="0" max="255" name="R${i}">
        <abbr title="Green color">G = </abbr><input type="number" value="0" min="0" max="255"  name="G${i}">
        <abbr title="Blue color">B = </abbr><input type="number" value="0" min="0" max="255"  name="B${i}"> 
        <select id="typeOfZone${i}" onchange= change(${i}) name='typeOfZone${i}' class="typeOfActiveZones">
            <option disabled>Тип активной зоны</option>
            <option value="Описание" selected>Описание</option>
            <option value="Переход к другой панараме">Переход к другой панараме</option>
        </select>
        <input type='text' id='discribe${i}' name='discribe${i}' required/>
        `;
    activeZones.appendChild(divRGB);

    selectTypeOfZone = document.querySelector(`#typeOfZone${i}`);
});

BtnRemoveActiveZone.addEventListener('click', () => {
    i--;
    activeZones.lastChild.remove(); 
});

function changeExcursions(i){
    let selectExcursions = document.querySelector(`#nameExcursions${i}`);
    if(selectExcursions.options.selectedIndex == 1){
        let inputExcursions = document.createElement('input');
        inputExcursions.type = 'text';
        inputExcursions.id = `inputExcursions${i}`;
        inputExcursions.name = `inputExcursions${i}`;
        document.querySelector(`#nameExcursions${i}`).after(inputExcursions);
    }else{
         document.querySelector(`#inputExcursions${i}`).remove();
    }
}

function change(i) {
    if(selectTypeOfZone.options.selectedIndex == 2){
        // добовляется список комнат для связи с данной
        nameExcursion = document.querySelector(`#nameCollection`);
        console.log(nameExcursion.value);
        if(nameExcursion.value == ''){
            alert('Напишите название экскурсии');
            selectTypeOfZone.options.selectedIndex = 1;
        }else {
            document.querySelector(`#discribe${i}`).remove();
            let formData = new FormData();
            formData.append(`nameExcursion`, nameExcursion.value);
 
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/listOfRelations');
            xhr.send(formData);
            xhr.onload = function() {
                let divSelect = document.createElement('div');
                divSelect.innerHTML = `<select id="nameExcursions${i}" name="nameExcursions${i}" onchange= 'changeExcursions(${i})' class="typeOfActiveZones"><option disabled selected>Список</option></select>`;
                document.querySelector(`#typeOfZone${i}`).after(divSelect);

                let selectExcursions = document.querySelector(`#nameExcursions${i}`);                
                let nameExcursions = xhr.response.split(',');
                
                selectExcursions.options[1] = new Option('Другой вариант', 'write');
                for (let j=0; j<nameExcursions.length-1; j++){
                    selectExcursions.options[j+2] = new Option(nameExcursions[j]);
                }         
                document.querySelector(`#typeOfZone${i}`).after(selectExcursions);
            };
        }
    } else{
        let inputText = document.createElement('input');
        let nameExcursions = document.querySelector(`#nameExcursions${i}`);
        if(nameExcursions){
            nameExcursions.remove();
        }
        inputText.type = "text";
        inputText.id = `discribe${i}`;
        inputText.name= `discribe${i}`;
        document.querySelector(`#typeOfZone${i}`).after(inputText);
    }
}

