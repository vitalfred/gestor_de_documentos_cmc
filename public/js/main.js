document.addEventListener('DOMContentLoaded', function () {
  const editButtons = document.querySelectorAll('.btn-edit');

  editButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const docType = this.getAttribute('data-document');
      const form = document.querySelector(`.form-edit[data-document="${docType}"]`);
      if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
      }
    });
  });
});
