// IntersectionObserver to reveal sections on scroll without external libraries.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-inner').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Highlight active nav link based on data-page attribute on <body>.
const currentPage = document.body.dataset.page;
if (currentPage) {
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
}

// Questionari (pàgina de resultats)
const quizForm = document.getElementById('quiz-form');
if (quizForm) {
  const answers = { q1: '35-15', q2: 'pla', q3: '2200', q4: '335' };
  const resultEl = document.getElementById('quiz-result');
  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let correct = 0;
    let total = 0;
    Object.entries(answers).forEach(([key, value]) => {
      total += 1;
      const checked = quizForm.querySelector(`input[name=\"${key}\"]:checked`);
      if (checked && checked.value === value) correct += 1;
    });
    if (resultEl) {
      const perfect = correct === total;
      resultEl.textContent = perfect
        ? `Genial! ${correct}/${total} respostes correctes.`
        : `${correct}/${total} correctes. Repassa l’apartat corresponent.`;
      resultEl.className = `quiz-result ${perfect ? 'good' : 'bad'}`;
    }
  });
}
