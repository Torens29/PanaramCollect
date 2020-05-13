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
        <select id="typeOfZone${i}" onchange= change(${i}) name='typeOfZone${i}'>
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
    if(selectTypeOfZone.options.selectedIndex == 0){
        let inputExcursions = document.createElement('input');
        inputExcursions.type = 'text'
                        //.id = `inputExcursions${i}`
                        //.name = `inputExcursions${i}`;
        document.querySelector(`#nameExcursions${i}`).after(inputExcursions);
    }
}

function change(i) {
    console.log('onChange= '+ i);
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
                selectExcursions = document.createElement('select');
                selectExcursions.id = `nameExcursions${i}`;
                selectExcursions.name = `nameExcursions${i}`;
                
                selectExcursions.onchange = `changeExcursions(${i})`;
                
                // selectExcursions.addEventListener('change', changeExcursions(i));

                let nameExcursions = xhr.response.split(',');
                selectExcursions.options[0] = new Option('Переход к','write',true, true);

                for (let j=0; j<nameExcursions.length-1; j++){
                    selectExcursions.options[j+1] = new Option(nameExcursions[j]);
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
        console.log('qweqweqwe');
        document.querySelector(`#typeOfZone${i}`).after(inputText);
    }
}

