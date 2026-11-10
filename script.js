const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function setMenuOpen(isOpen) {
  if (!menuToggle || !navigation) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  navigation.classList.toggle("is-open", isOpen);
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm instanceof HTMLFormElement && formStatus) {
  const submitButton = contactForm.querySelector('button[type="submit"]');

  if (submitButton) {
    const buttonLabel = submitButton.firstChild;

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity() || submitButton.disabled) return;

      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      if (buttonLabel) buttonLabel.nodeValue = "Sending... ";
      formStatus.textContent = "";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errors = Array.isArray(result.errors)
            ? result.errors.map((error) => error?.message).filter(Boolean).join(" ")
            : "";
          throw new Error(errors || "We couldn't send your message. Please try again.");
        }

        contactForm.reset();
        formStatus.textContent = "Thank you for your message. It has been sent successfully.";
      } catch (error) {
        formStatus.textContent =
          error instanceof TypeError
            ? "We couldn't connect to the contact form. Please check your connection and try again."
            : error instanceof Error
              ? error.message
              : "We couldn't send your message. Please try again.";
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        if (buttonLabel) buttonLabel.nodeValue = "Send a message ";
      }
    });
  }
}
