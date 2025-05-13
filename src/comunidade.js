const complaints = document.querySelector('#complaints');

function generateRow(title, author, comments, date) {
    const row = document.createElement('tr');
    row.classList = ['border-b', 'boder-gray-200'];
    row.innerHTML = `
        <td class="py-3 px-4">
            <a href="#" class="text-blue-medium hover:text-blue-light">${title}</a>
        </td>
        <td class="py-3 px-4">${author}</td>
        <td class="py-3 px-4">${comments}</td>
        <td class="py-3 px-4">${date}</td>
    `;

    return row;
}

async function getComplaints() {
    const res = await fetch('https://express-api-h6xd.onrender.com/denuncias');
    const data = await res.json();

    console.log(data);
}

getComplaints();