document.addEventListener("DOMContentLoaded", () => {
    const API = "https://express-api-h6xd.onrender.com";

    var map = L.map('map').setView([-2.541441, -44.256159], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


  const complaints = document.querySelector("#complaints")


  // Modal elements - will be created dynamically
  let modal
  let modalOverlay

  // Create modal elements
  function createModalElements() {
    // Create modal overlay
    modalOverlay = document.createElement("div")
    modalOverlay.className = "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden"
    modalOverlay.id = "topic-modal-overlay"

    // Create modal container
    modal = document.createElement("div")
    modal.className = "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    modal.id = "topic-modal"

    // Add close button functionality
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal()
      }
    })

    // Add modal to overlay
    modalOverlay.appendChild(modal)

    // Add overlay to body
    document.body.appendChild(modalOverlay)
  }

  // Initialize modal
  createModalElements()

  // Get complaints and render them
  getComplaints().then((data) => {
    complaints.innerHTML = ""
    setMarkers(map, data);
    data.forEach((complaint) => {
      console.log(complaint)
      complaints.append(generateRow(complaint))
    })
  })

    function setMarkers(map, points) {
        for (const {latitude, longitude} of points) {
            L.marker([latitude, longitude]).addTo(map);
        }
    }

  function generateRow({ title, author, category, comments, date, id, description, likes, dislikes }) {
    const row = document.createElement("tr")
    row.classList = ["border-b", "border-gray-200", "hover:bg-gray-50", "cursor-pointer"]

    // Format the category for display
    const formatedCategory = formatCategory(category)

    // Set the number of comments (default to 0 if undefined)
    const commentCount = comments ? comments.length : 0

    row.innerHTML = `
      <td class="py-3 px-4">
        <p class="text-blue-medium hover:text-blue-light" style="cursor: pointer">${title}</p>
      </td>
      <td class="py-3 px-4">${author || "Anônimo"}</td>
      <td class="py-3 px-4">${formatedCategory}</td>
      <td class="py-3 px-4">${commentCount}</td>
      <td class="py-3 px-4">${formatDate(date._seconds)}</td>
    `

    // Add click event to open the topic modal
    row.addEventListener("click", async () => {
        const res = await fetch(`${API}/comentarios/${id}`);
        const { data } = await res.json();
        console.log(data);

      openTopicModal({
        id,
        title,
        author,
        category: formatedCategory,
        description,
        date: formatDate(date._seconds),
        comments: data || [],
        likes: likes || 0,
        dislikes: dislikes || 0,
      })
    })

    return row
  }

  // Format category names for better display
  function formatCategory(category) {
    if (!category) return "Geral"

    const categoryMap = {
      "reclamacao-denuncia": "Reclamação/Denúncia",
      sugestao: "Sugestão",
      elogio: "Elogio",
      duvida: "Dúvida",
    }

    return categoryMap[category] || category
  }

  // Open topic modal with details
  function openTopicModal(topic) {
    // Create modal content
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-blue-dark">${topic.title}</h2>
          <button id="close-modal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="mb-4 text-sm text-gray-600">
          <span>Por: ${topic.author || "Anônimo"}</span> • 
          <span>Categoria: ${topic.category}</span> • 
          <span>Data: ${topic.date}</span>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <p class="text-gray-800 whitespace-pre-line">${topic.description}</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg border border-gray-300">
            <h4 class="font-bold text-blue-dark mb-2">Adicionar comentário</h4>
            <div class="mb-3">
                <input type="text" id="comment-author" placeholder="Seu nome (opcional)" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-medium">
            </div>
            <div class="mb-3">
                <textarea id="comment-text" placeholder="Escreva seu comentário..." rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-medium" required></textarea>
            </div>
            <button id="submit-comment" data-id="${topic.id}" class="px-4 py-2 bg-blue-medium hover:bg-blue-light text-white rounded-md transition-colors">
                Enviar comentário
            </button>
        </div>

        <div class="border-t border-gray-200 pt-6 mb-6">
          <h3 class="text-xl font-bold text-blue-dark mb-4">Comentários (${topic.comments.length})</h3>
          
          <div id="comments-container" class="space-y-4 mb-6">
            ${
              topic.comments.length > 0
                ? topic.comments
                    .map(
                      (comment) => `
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between mb-2">
                    <span class="font-medium">${comment.author || "Anônimo"}</span>
                    <span class="text-sm text-gray-500">${formatDate(comment.date?._seconds || Date.now() / 1000)}</span>
                  </div>
                  <p class="text-gray-700">${comment.comment}</p>
                </div>
              `,
                    )
                    .join("")
                : '<p class="text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>'
            }
          </div>
          
        </div>
      </div>
    `

    // Show modal
    modalOverlay.classList.remove("hidden")

    // Add event listeners for modal interactions
    setupModalInteractions(topic)
  }

  // Setup event listeners for modal interactions
  function setupModalInteractions(topic) {
    // Close modal button
    const closeButton = document.getElementById("close-modal")
    if (closeButton) {
      closeButton.addEventListener("click", closeModal)
    }

    // Submit comment button
    const submitCommentButton = document.getElementById("submit-comment")
    if (submitCommentButton) {
      submitCommentButton.addEventListener("click", async () => {
        const authorInput = document.getElementById("comment-author")
        const textInput = document.getElementById("comment-text")

        const author = authorInput.value.trim()
        const comment = textInput.value.trim()

        if (!comment) {
          alert("Por favor, escreva um comentário antes de enviar.")
          return
        }

        const response = await addComment(topic.id, {
          author: author || "Anônimo",
          comment,
        })

        if (response.success) {
          // Add the new comment to the comments container
          const commentsContainer = document.getElementById("comments-container")

          // Clear "no comments" message if it exists
          if (commentsContainer.querySelector("p.text-gray-500")) {
            commentsContainer.innerHTML = ""
          }

          // Create and append the new comment
          const commentElement = document.createElement("div")
          commentElement.className = "bg-gray-50 p-4 rounded-lg"
          commentElement.innerHTML = `
            <div class="flex justify-between mb-2">
              <span class="font-medium">${author || "Anônimo"}</span>
              <span class="text-sm text-gray-500">${formatDate(Date.now() / 1000)}</span>
            </div>
            <p class="text-gray-700">${comment}</p>
          `

          commentsContainer.appendChild(commentElement)

          // Clear the form
          authorInput.value = ""
          textInput.value = ""

          // Update comment count in the modal title
          const commentCountEl = modal.querySelector("h3.text-xl")
          const currentCount = Number.parseInt(commentCountEl.textContent.match(/\d+/)[0])
          commentCountEl.textContent = `Comentários (${currentCount + 1})`

          // Refresh the main list to show updated counts
          refreshComplaintsList()
        }
      })
    }
  }

  // Close the modal
  function closeModal() {
    modalOverlay.classList.add("hidden")
  }

  // Add a comment
  async function addComment(id, comment) {
    try {
      const response = await fetch(`https://express-api-h6xd.onrender.com/comentarios/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      })

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      return { success: false, error }
    }
  }

  // Refresh the complaints list
  async function refreshComplaintsList() {
    const data = await getComplaints()
    complaints.innerHTML = ""
    data.forEach((complaint) => {
      complaints.append(generateRow(complaint))
    })
  }

  async function getComplaints() {
    try {
      const res = await fetch("https://express-api-h6xd.onrender.com/denuncias")
      const data = await res.json()
      return data
    } catch (error) {
      console.error("Erro ao buscar denúncias:", error)
      return []
    }
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000)

    const formatedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`

    return formatedDate
  }
})