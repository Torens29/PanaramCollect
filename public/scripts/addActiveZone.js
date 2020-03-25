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
        <input type='text' id='discribe${i}'/>
        <br><br>`;
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
         document.querySelector(`#discribe${i}`).remove();
    } else{
        let inputText = document.createElement('input');
        inputText.type = "text";
        inputText.id = `#discribe${i}`;
        console.log(document.querySelector(`typeOfZone${i}`));
        document.querySelector(`#typeOfZone${i}`).after(inputText);
    }
}


