const complaints = document.querySelector('#complaints');

getComplaints()
.then((data) => {
    complaints.innerHTML = '';
    data.forEach(e => {
        console.log(e);
        complaints.append(generateRow(e));
    });
})

function generateRow({title, author, category, comments, date}) {
    const row = document.createElement('tr');
    row.classList = ['border-b', 'boder-gray-200'];
    row.innerHTML = `
        <td class="py-3 px-4">
            <a href="#" class="text-blue-medium hover:text-blue-light">${title}</a>
        </td>
        <td class="py-3 px-4">${author}</td>
        <td class="py-3 px-4">${category}</td>
        <td class="py-3 px-4">${0}</td>
        <td class="py-3 px-4">${formatDate(date._seconds)}</td>
    `;

    return row;
}

async function getComplaints() {
    try {
        const res = await fetch('https://express-api-h6xd.onrender.com/denuncias');
        const data = await res.json();
        return data; 
    } catch (erro) {
        return [];
    }
    
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
    (date.getMonth() + 1).toString().padStart(2, '0')}/${
    date.getFullYear()}`;
    
    return formattedDate;
}

getComplaints();