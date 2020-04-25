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
        <select id="typeOfZone${i}" onchange= change(${i})>
            <option disabled>Тип активной зоны</option>
            <option value="Описание" selected>Описание</option>
            <option value="Переход к другой панараме">Переход к другой панараме</option>
        </select>
        <input type='text' id='discribe${i}' name='discribe${i}' required/>
        `;
    activeZones.appendChild(divRGB);
    console.log(divRGB);

    selectTypeOfZone = document.querySelector(`#typeOfZone${i}`);
    console.log(selectTypeOfZone);
});

BtnRemoveActiveZone.addEventListener('click', () => {
    i--;
    activeZones.lastChild.remove(); 
});

function change(i) {
    console.log('onChange= '+ i);
    if(selectTypeOfZone.options.selectedIndex == 2){
        // добовляется список комнат для связи с данной
        nameExcursion = document.querySelector('#nameCollection');
        console.log(nameExcursion.value);
        if(nameExcursion.value == ''){
            alert('Напишите название экскурсии');

            selectTypeOfZone.options.selectedIndex = 1;
        }else {
            document.querySelector(`#discribe${i}`).remove();//
            let formData = new FormData();
            formData.append('nameExcursion', nameExcursion.value);
 
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/listOfRelations');
            xhr.send(formData);
            xhr.onload = function() {
                console.log(' xhr.response: '+ xhr.response);
                let select = document.createElement('select');
                select.id='nameExcursion';

                let nameExcursion = xhr.response.split(',');
                console.log(nameExcursion.length);
                for (let i=0; i<nameExcursion.length-1;i++){
                    select.options[i] = new Option(nameExcursion[i]);
                };                
                document.querySelector(`#typeOfZone${i}`).after(select);
                
            };
        }
    } else{

        let inputText = document.createElement('input');
        let nameExcursion = document.querySelector("#nameExcursion");
        if(nameExcursion){
            nameExcursion.remove();
        }
        inputText.type = "text";
        inputText.id = `discribe${i}`;
        inputText.name= `discribe${i}`;
        
        document.querySelector(`#typeOfZone${i}`).after(inputText);
    }
}


