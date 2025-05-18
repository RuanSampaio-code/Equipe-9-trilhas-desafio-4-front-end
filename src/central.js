document.addEventListener("DOMContentLoaded", () => {
  // Funcionalidade do menu mobile
  const menuButton = document.querySelector(".md\\:hidden.text-white")
  const mobileMenu = document.getElementById("mobile-menu")

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")
    })
  }

  const complaintForm = document.querySelector("#complaint-form")
  const feedbackSucesso = document.getElementById("feedback-sucesso")
  const protocolo = document.getElementById("protocolo")

  if (complaintForm) {
    const autho = document.querySelector("#author")
    const category = document.querySelector("#category")
    const busline = document.querySelector("#busline")
    const title = document.querySelector("#title")
    const description = document.querySelector("#description")
    const latitude = document.querySelector("#latitude")
    const longitude = document.querySelector("#longitude")
    const submit = complaintForm.querySelector("#submit-btn")

    const validateForm = () => {
      document.querySelectorAll(".error-message").forEach((el) => el.remove())

      let isValid = true

      if (!category.value) {
        isValid = false
        displayError(category, "Por favor, selecione o tipo de mensagem")
      }

      if (!latitude.value || !longitude.value) {
        isValid = false
        const modalBtn = document.getElementById("modal-btn")
        displayError(modalBtn, "Por favor, selecione o local")
      }

      if (!title.value.trim()) {
        isValid = false
        displayError(title, "Por favor, preencha este campo")
      }

      if (!description.value.trim()) {
        isValid = false
        displayError(description, "Por favor, preencha este campo")
      }

      const termos = document.getElementById("termos")
      if (!termos.checked) {
        isValid = false
        displayError(termos, "Você precisa concordar com os termos")
      }

      return isValid
    }


    const displayError = (element, message) => {
      const errorDiv = document.createElement("div")
      errorDiv.className = "error-message text-red-500 text-sm mt-1 flex items-center"

      const icon = document.createElement("i")
      icon.className = "fas fa-circle-exclamation mr-1"
      errorDiv.appendChild(icon)

      const textSpan = document.createElement("span")
      textSpan.textContent = message
      errorDiv.appendChild(textSpan)

      if (element.type === "checkbox") {
        const checkboxContainer = element.closest(".flex.items-start")
        if (checkboxContainer) {
          checkboxContainer.parentNode.insertBefore(errorDiv, checkboxContainer.nextSibling)
        } else {
          const parentDiv = element.closest("div")
          parentDiv.parentNode.insertBefore(errorDiv, parentDiv.nextSibling)
        }
      } else {
        element.parentNode.insertBefore(errorDiv, element.nextSibling)
      }

      element.classList.add("border-red-500")

      element.addEventListener("input", () => {
        element.classList.remove("border-red-500")
        const errorMsg = document.querySelector(".error-message")
        if (errorMsg) errorMsg.remove()
      })

      if (element.tagName === "SELECT") {
        element.addEventListener("change", () => {
          element.classList.remove("border-red-500")
          const errorMsg = element.parentNode.querySelector(".error-message")
          if (errorMsg) errorMsg.remove()
        })
      }

      if (element.type === "checkbox") {
        element.addEventListener("change", () => {
          const checkboxContainer = element.closest(".flex.items-start")
          const errorMsg = checkboxContainer
            ? checkboxContainer.parentNode.querySelector(".error-message")
            : document.querySelector(".error-message")
          if (errorMsg) errorMsg.remove()
        })
      }

      if (element.id === "modal-btn") {
        const modalCloseBtn = document.querySelector("[data-modal-hide='default-modal']")
        if (modalCloseBtn) {
          modalCloseBtn.addEventListener("click", () => {
            const errorMsg = element.parentNode.querySelector(".error-message")
            if (errorMsg && latitude.value && longitude.value) {
              errorMsg.remove()
            }
          })
        }
      }
    }

    submit.addEventListener("click", async (e) => {
      e.preventDefault()

      if (!validateForm()) {
        const firstError = document.querySelector(".error-message")
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        return 
      }

      const complaintData = {
        author: autho.value,
        category: category.value,
        busline: busline.value,
        title: title.value,
        description: description.value,
        localization: [latitude.value, longitude.value],
      }

      console.log(JSON.stringify(complaintData))

      try {
        const res = await fetch("https://express-api-h6xd.onrender.com/denuncias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(complaintData),
        })

        const data = await res.json()
        console.log(data)

        setTimeout(() => {
          const numeroProtocolo = "REC-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000)
          if (protocolo) {
            protocolo.textContent = numeroProtocolo
          }

          if (feedbackSucesso) {
            feedbackSucesso.classList.remove("hidden")
            feedbackSucesso.scrollIntoView({ behavior: "smooth"})
          }

          complaintForm.reset()

          latitude.value = ""
          longitude.value = ""
        }, 1000)
      } catch (error) {
        console.error("Erro ao enviar denúncia:", error)
        alert("Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente.")
      }
    })

    // Adicionar evento para o botão de confirmação do modal
    const confirmLocationBtn = document.querySelector("[data-modal-hide='default-modal']")
    if (confirmLocationBtn) {
      confirmLocationBtn.addEventListener("click", () => {
        // Remover mensagem de erro do local se as coordenadas estiverem preenchidas
        if (latitude.value && longitude.value) {
          const modalBtn = document.getElementById("modal-btn")
          const errorMsg = modalBtn.parentNode.querySelector(".error-message")
          if (errorMsg) errorMsg.remove()
          modalBtn.classList.remove("border-red-500")
          modalBtn.classList.add("bg-green-700")
          modalBtn.textContent = "Local selecionado ✓"
        }
      })
    }
  }
})