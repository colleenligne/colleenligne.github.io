document.addEventListener("DOMContentLoaded", () => {
  const subjectFilter = document.getElementById("subject-filter");
  const levelFilter = document.getElementById("level-filter");
  const cards = document.querySelectorAll("a[data-subject][data-level]");

  function filterCards() {
    const subject = subjectFilter.value;
    const level = levelFilter.value;

    cards.forEach(card => {
      const cardSubject = card.dataset.subject;
      const cardLevel = card.dataset.level;

      const matchSubject = subject === "all" || cardSubject === subject;
      const matchLevel = level === "all" || cardLevel === level;

      if (matchSubject && matchLevel) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }

  subjectFilter.addEventListener("change", filterCards);
  levelFilter.addEventListener("change", filterCards);

  // Appel initial
  filterCards();
});
