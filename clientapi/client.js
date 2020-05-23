window.onload = function () {
    $buttonLoad = document.querySelectorAll('.button-load');
    $total = document.querySelector('#td-total');
    $inputFilter = document.querySelector('#input-filter');
    $loading = document.querySelector('#loading');
    $message = document.querySelector('#message');
    $table = document.querySelector('table');

    $buttonLoad.forEach(element => {
        element.addEventListener('click', async function (event) {
            event.preventDefault();
            filter = element.dataset.param === '1' ? $inputFilter.value : '';
            $table.classList.add('hidden');
            $loading.innerHTML = 'Cargando...';
            try {
                //local http://localhost/api/Products/
                response = await fetch('https://sebastianprojectapi.000webhostapp.com/api/Products/' + filter, {
                    method: 'GET',
                });
                dataJson = await response.json();
                $loading.innerHTML = '';
                if (dataJson.length > 0) {
                    [html, total] = createDataTable(dataJson);
                    $table.querySelector('tbody').innerHTML = html;
                    $total.innerHTML = total;
                    $message.classList.add('hidden');
                    $table.classList.remove('hidden');
                    return true;
                }
                $message.classList.remove('hidden');
                $message.innerHTML = 'No existen datos';
            } catch (error) {
                $message.classList.remove('hidden');
                $message.innerHTML = error;
                $message.style.borderBottom = '2px red solid';
            }
            $loading.innerHTML = '';

        })
    });

    function createDataTable($data) {
        html = ''
        total = 0.00;
        $data.forEach(element => {
            html += `<tr>
                <td>${element.codigo}</td>
                <td>${element.descripcion}</td>
                <td>${element.marca}</td>
                <td>${parseFloat(element.precio_unitario)}</td>
            </tr>`;
            total += parseFloat(element.precio_unitario);
        });

        return [html, total];
    }
};