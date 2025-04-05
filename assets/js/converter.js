async function converter() {
    const button = document.querySelector('.button-converter');
    const originalText = button.innerHTML;

    button.setAttribute('disabled', true);
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...';

    const moneys = ['USD', 'BRL', 'EUR', 'GBP'];
    const typeMoney = [
        { name: 'USD', value: '$' },
        { name: 'BRL', value: 'R$' },
        { name: 'EUR', value: '€' },
        { name: 'GBP', value: '£' }
    ];

    const moneyOne = document.querySelector('#money-one').textContent.trim('');
    const moneyTwo = document.querySelector('#money-two').textContent.trim('');
    const inputMoneyOne = document.querySelector('#input-money-one').value;

    if (!moneys.includes(moneyOne) || !moneys.includes(moneyTwo)) {
        alert('Informe uma moeda válida!');
        resetButton();
        return;
    }

    if (moneyOne === moneyTwo) {
        alert('Informe moedas diferentes');
        resetButton();
        return;
    }

    if (inputMoneyOne.length === 0 || inputMoneyOne == 0 || inputMoneyOne < 0) {
        alert('Informe um valor válido para conversão');
        resetButton();
        return;
    }

    const moneOneValueBcb = document.querySelector(`#${moneyOne}`).getAttribute('data-value');
    const moneTwoValueBcb = document.querySelector(`#${moneyTwo}`).getAttribute('data-value');

    moment.locale();

    const url = `https://www3.bcb.gov.br/bc_moeda/rest/converter/${inputMoneyOne}/1/${moneOneValueBcb}/${moneTwoValueBcb}/${moment().format('YYYY-MM-DD')}`;
    
    try {
        let x2js = new X2JS();

        await $.ajax({
            url,
            dataType: 'XML',
            success: function (data) {
                const jsonObj = x2js.xml2json(data);
                const moeda = typeMoney.find(value => value.name === moneyTwo);
                document.querySelector('#input-money-two').value = moeda.value + String(Number(jsonObj['valor-convertido']).toFixed(2));
            },
            error: function () {
                alert('Erro ao buscar cotação atual');
            }
        });
    } catch (error) {
        alert('Ocorreu um erro ao buscar os dados: ' + error);
    }

    try {
        const x2js2 = new X2JS();
        const promises = [];

        for (let i = 0; i <= 6; i++) {
            const dateStr = moment().subtract(i, 'days').format('YYYY-MM-DD');
            const url2 = `https://www3.bcb.gov.br/bc_moeda/rest/converter/${inputMoneyOne}/1/${moneOneValueBcb}/${moneTwoValueBcb}/${dateStr}`;

            const promise = new Promise((resolve) => {
                $.ajax({
                    url: url2,
                    dataType: 'XML',
                    success: function (data) {
                        const jsonObj = x2js2.xml2json(data);
                        resolve({
                            data: dateStr,
                            cotacao: Number(jsonObj['valor-convertido']).toFixed(2)
                        });
                    },
                    error: function () {
                        console.warn(`Erro ao buscar: ${dateStr}`);
                        resolve(null);
                    }
                });
            });

            promises.push(promise);
        }

        const results = await Promise.all(promises);
        const dados = results.filter(item => item !== null);

        renderizarGrafico(dados);
    } catch (e) {
        console.error("Erro ao gerar gráfico:", e);
    }

    resetButton();

    function resetButton() {
        button.removeAttribute('disabled');
        button.innerHTML = originalText;
    }
}
