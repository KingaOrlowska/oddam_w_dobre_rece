console.log("Hello world");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed.");

  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      this.$buttonsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      this.$el.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("btn") &&
          e.target.parentElement.parentElement.classList.contains("help--slides-pagination")
        ) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      [...this.$buttonsContainer.children].forEach((btn) =>
        btn.firstElementChild.classList.remove("active")
      );
      $btn.classList.add("active");

      this.currentSlide = $btn.parentElement.dataset.id;

      this.$slidesContainers.forEach((el) => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;
    }
  }

  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;
      this.valueInput.hidden = true;

      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      this.ul = document.createElement("ul");

      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", (e) => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
          this.ul.querySelector(".selected").classList.remove("selected");
          target.classList.add("selected");
        }
      });
    }
  }

  document.querySelectorAll(".form-group--dropdown select").forEach((el) => {
    new FormSelect(el);
  });

  document.addEventListener("click", function (e) {
    const target = e.target;

    if (target.closest(".dropdown")) return false;

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach((el) => {
      el.classList.remove("selecting");
    });
  });

  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.summaryItems = document.getElementById("summary-items");
      this.summaryAddress = document.getElementById("summary-address");
      this.summaryDate = document.getElementById("summary-date");

      this.init();
    }

    init() {
      this.events();
      this.updateForm();
      this.filterOrganizations();
    }

    events() {
      this.$next.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      this.$prev.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      this.$form.querySelector("form").addEventListener("submit", (e) => this.submit(e));

      document.querySelectorAll('input[name="categories"]').forEach((input) => {
        input.addEventListener("change", this.filterOrganizations.bind(this));
      });
    }

    updateForm() {
      this.$step.innerText = this.currentStep;

      this.slides.forEach((slide) => {
        slide.classList.toggle("active", slide.dataset.step == this.currentStep);
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      if (this.currentStep === 3) {
        this.filterOrganizations();
      }

      if (this.currentStep === 5) {
        this.updateSummary();
      }
    }

    updateSummary() {
      const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
        .map(input => input.nextElementSibling.nextElementSibling.innerText);

      const bags = document.querySelector('input[name="bags"]').value;

      const organization = document.querySelector('input[name="organization"]:checked')
        .closest(".form-group--checkbox").querySelector(".title").innerText;

      const address = {
        street: document.querySelector('input[name="address"]').value,
        city: document.querySelector('input[name="city"]').value,
        postcode: document.querySelector('input[name="postcode"]').value,
        phone: document.querySelector('input[name="phone"]').value,
      };

      const pickUp = {
        date: document.querySelector('input[name="data"]').value,
        time: document.querySelector('input[name="time"]').value,
        comment: document.querySelector('textarea[name="more_info"]').value,
      };

      this.summaryItems.innerHTML = `<li>${bags} worki z: ${selectedCategories.join(", ")}</li>`;

      this.summaryAddress.innerHTML = `
        <li>${address.street}</li>
        <li>${address.city}</li>
        <li>${address.postcode}</li>
        <li>${address.phone}</li>
      `;

      this.summaryDate.innerHTML = `
        <li>${pickUp.date}</li>
        <li>${pickUp.time}</li>
        <li>${pickUp.comment}</li>
      `;
    }

    filterOrganizations() {
      console.log("Filtering organizations");
      try {
        const selectedCategories = Array.from(
          document.querySelectorAll('input[name="categories"]:checked')
        ).map((input) => input.value);
        console.log("Selected categories:", selectedCategories);

        document.querySelectorAll(".organization").forEach((org) => {
          const orgCategories = org.getAttribute("data-categories").split(',');

          const selectedCategoriesNum = selectedCategories.map(Number);
          const orgCategoriesNum = orgCategories.map(Number);

          const isMatch = selectedCategoriesNum.some((category) =>
            orgCategoriesNum.includes(category)
          );

          if (isMatch) {
            org.style.display = "block";
          } else {
            org.style.display = "none";
          }
        });
      } catch (error) {
        console.error("Error in filterOrganizations:", error);
      }
    }

    submit(e) {
      e.preventDefault();
      console.log("Form submitted, sending data to server");

      const formData = new FormData(this.$form.querySelector("form"));
      const confirmationUrl = this.$form.querySelector("form").dataset.confirmationUrl;

      fetch(this.$form.querySelector("form").action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': formData.get('csrfmiddlewaretoken')
        }
      })
      .then(response => response.ok ? response.text() : Promise.reject(response.status))
      .then(data => {
        window.location.href = confirmationUrl;
      })
      .catch(error => {
        console.error('Błąd przy wysyłaniu formularza:', error);
      });
    }
  }

  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});
