
async function converter() {
    const moneys = ['USD', 'BRL', 'EUR', 'GBP'];
    const typeMoney = [
        {
            'name': 'USD',
            'value': '$'
        },

        {
            'name': 'BRL',
            'value': 'R$'
        },

        {
            'name': 'EUR',
            'value': '€'
        },

        {
            'name': 'GBP',
            'value': '£'
        }
    ]

    const moneyOne = document.querySelector('#money-one').textContent.trim('')
    const moneyTwo = document.querySelector('#money-two').textContent.trim('')

    const inputMoneyOne = document.querySelector('#input-money-one').value

    if (moneys.includes(moneyOne) == false || moneys.includes(moneyTwo) == false) {
       return alert('Informe uma moeda válida!')
    }

    if(moneyOne == moneyTwo) {
        return alert('Informe moedas diferentes')
    }

    if(inputMoneyOne.length == 0 || inputMoneyOne == 0 || inputMoneyOne < 0) {
        return alert('Informe um valor válido para conversão')
    }

    const moneOneValueBcb = document.querySelector(`#${moneyOne}`).attributes['data-value']['value']
    const moneTwoValueBcb = document.querySelector(`#${moneyTwo}`).attributes['data-value']['value']

    const url = `https://www3.bcb.gov.br/bc_moeda/rest/converter/${inputMoneyOne}/1/${moneOneValueBcb}/${moneTwoValueBcb}/${new Date().toISOString().slice(0,10)}`
    
    try {

        let x2js = new X2JS();

        $.ajax({
            url,
            dataType: 'XML',
            success: function(data) {
                var xmlText = data; // XML
                var jsonObj = x2js.xml2json(xmlText); // Convert XML to JSON
                console.log(jsonObj, typeMoney.filter(value => value.name == moneyTwo));

                let moeda = typeMoney.filter(value => value.name == moneyTwo);

                document.querySelector('#input-money-two').value = moeda[0].value + String(Number(jsonObj['valor-convertido']).toFixed(2))
            }
        });

        
    } catch (error) {
        return alert('Ocorreu um erro ao buscar os dados' + error)
    }
}

function changeSelect(element) {

    const elementSpan = [
        {
            'name': 'USD',
            'value': 'fi',
            'value2': 'fi-us',
            'value3': 'fis'
        },

        {
            'name': 'BRL',
            'value': 'fi',
            'value2': 'fi-br',
            'value3': 'fis'
        },

        {
            'name': 'EUR',
            'value': 'fi',
            'value2': 'fi-eu',
            'value3': 'fis'
        },

        {
            'name': 'GBP',
            'value': 'fi',
            'value2': 'fi-gb',
            'value3': 'fis'
        }
    ]

    if(element.attributes['data-type']['value'] == 'money-one') {
        let div = document.querySelector('div#money-one')
        let span = document.querySelector('div#money-one > span')

        div.removeChild(span);

        let spanCreate = elementSpan.filter(value => value.name == element.attributes['id']['value'])

        let spanElementeCreate = document.createElement('span');
        spanElementeCreate.classList.add(`${spanCreate[0].value}`)
        spanElementeCreate.classList.add(`${spanCreate[0].value2}`)
        spanElementeCreate.classList.add(`${spanCreate[0].value3}`)
        spanElementeCreate.before('\00a0')

        div.textContent = element.attributes['id']['value'];
        div.appendChild(spanElementeCreate)

    } else if(element.attributes['data-type']['value'] == 'money-two') {
        let div = document.querySelector('div#money-two')
        let span = document.querySelector('div#money-two > span')

        div.removeChild(span);

        let spanCreate = elementSpan.filter(value => value.name == element.attributes['id']['value'])

        let spanElementeCreate = document.createElement('span');
        spanElementeCreate.classList.add(`${spanCreate[0].value}`)
        spanElementeCreate.classList.add(`${spanCreate[0].value2}`)
        spanElementeCreate.classList.add(`${spanCreate[0].value3}`)
        spanElementeCreate.before('\00a0')

        div.textContent = element.attributes['id']['value'];
        div.appendChild(spanElementeCreate)
    }   

}