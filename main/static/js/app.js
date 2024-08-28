console.log("Skrypt app.js załadowany");

document.addEventListener("DOMContentLoaded", function () {
    try {
        console.log("DOMContentLoaded fired");  // Log, aby upewnić się, że event jest załadowany

        /**
         * Form Steps - Klasa do obsługi nawigacji formularza i filtrowania organizacji
         */
        class FormSteps {
            constructor(form) {
                try {
                    this.$form = form;
                    this.$next = form.querySelectorAll(".next-step");
                    this.$prev = form.querySelectorAll(".prev-step");
                    this.$step = form.querySelector(".form--steps-counter span");
                    this.currentStep = 1;

                    this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
                    const $stepForms = form.querySelectorAll("form > div");
                    this.slides = [...this.$stepInstructions, ...$stepForms];

                    this.init();
                } catch (error) {
                    console.error("Błąd w konstruktorze FormSteps:", error);
                }
            }

            init() {
                try {
                    this.events();
                    this.updateForm();
                    this.filterOrganizations(); // Inicjalne filtrowanie organizacji
                } catch (error) {
                    console.error("Błąd w init FormSteps:", error);
                }
            }

            events() {
                try {
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

                    // Event listener do filtrowania organizacji
                    document.querySelectorAll('input[name="categories"]').forEach((input) => {
                        input.addEventListener("change", this.filterOrganizations.bind(this));
                    });
                } catch (error) {
                    console.error("Błąd w events FormSteps:", error);
                }
            }

            updateForm() {
                try {
                    this.$step.innerText = this.currentStep;

                    this.slides.forEach((slide) => {
                        slide.classList.remove("active");

                        if (slide.dataset.step == this.currentStep) {
                            slide.classList.add("active");
                        }
                    });

                    this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
                    this.$step.parentElement.hidden = this.currentStep >= 6;

                    // Wyświetl podsumowanie, jeśli na kroku 5
                    if (this.currentStep === 5) {
                        this.displaySummary();
                    }

                } catch (error) {
                    console.error("Błąd w updateForm:", error);
                }
            }

            filterOrganizations() {
                try {
                    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map((input) => input.value);
                    console.log("Wybrane kategorie:", selectedCategories); // Logowanie wybranych kategorii

                    document.querySelectorAll(".organization").forEach((org) => {
                        const orgCategories = org.getAttribute("data-categories").split(',');
                        console.log("Kategorie organizacji:", orgCategories); // Logowanie kategorii organizacji

                        const isMatch = selectedCategories.some((category) => orgCategories.includes(category));

                        if (isMatch) {
                            org.style.display = "block";
                            console.log(`Pokazuję organizację: ${org.querySelector('.title').innerText}`); // Logowanie, która organizacja jest pokazywana
                        } else {
                            org.style.display = "none";
                            console.log(`Ukrywam organizację: ${org.querySelector('.title').innerText}`); // Logowanie, która organizacja jest ukrywana
                        }
                    });
                } catch (error) {
                    console.error("Błąd w filterOrganizations:", error);
                }
            }

            submit(e) {
                e.preventDefault();
                try {
                    this.currentStep++;
                    this.updateForm();
                } catch (error) {
                    console.error("Błąd w submit FormSteps:", error);
                }
            }

            displaySummary() {
                try {
                    const itemsSummary = document.getElementById('summary-items');
                    const addressSummary = document.getElementById('summary-address');
                    const dateSummary = document.getElementById('summary-date');

                    itemsSummary.innerHTML = ''; // Czyścimy przed dodaniem nowych elementów
                    addressSummary.innerHTML = '';
                    dateSummary.innerHTML = '';

                    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
                        .map(input => input.nextElementSibling.nextElementSibling.innerText);
                    selectedCategories.forEach(category => {
                        const li = document.createElement('li');
                        li.innerText = category;
                        itemsSummary.appendChild(li);
                    });

                    const address = document.querySelector('input[name="address"]').value;
                    const city = document.querySelector('input[name="city"]').value;
                    const postcode = document.querySelector('input[name="postcode"]').value;
                    const phone = document.querySelector('input[name="phone"]').value;

                    const liAddress = document.createElement('li');
                    liAddress.innerText = `${address}, ${city}, ${postcode}, ${phone}`;
                    addressSummary.appendChild(liAddress);

                    const date = document.querySelector('input[name="data"]').value;
                    const time = document.querySelector('input[name="time"]').value;

                    const liDate = document.createElement('li');
                    liDate.innerText = `${date}, ${time}`;
                    dateSummary.appendChild(liDate);
                } catch (error) {
                    console.error("Błąd w displaySummary:", error);
                }
            }
        }

        const form = document.querySelector(".form--steps");
        if (form !== null) {
            new FormSteps(form);
        }

        console.log("JavaScript załadowany i gotowy."); // Dodatkowy log, aby upewnić się, że JS jest załadowany
    } catch (error) {
        console.error("Błąd w głównym kodzie JavaScript:", error);
    }
});
