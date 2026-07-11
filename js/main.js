function getField(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

fetch("content/site.json")
  .then((res) => res.json())
  .then((data) => {
    document.querySelectorAll("[data-field]").forEach((el) => {
      const value = getField(data, el.getAttribute("data-field"));
      if (value === undefined) return;
      el.textContent = value;
      const hrefField = el.getAttribute("data-href-field");
      if (hrefField) {
        const href = getField(data, hrefField);
        if (href) el.setAttribute("href", href);
      }
    });

    const programsList = document.getElementById("programs-list");
    if (programsList && data.programs && data.programs.items) {
      programsList.innerHTML = data.programs.items
        .map(
          (item) => `
        <div class="card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>`
        )
        .join("");
    }

    const contactDetails = document.getElementById("contact-details");
    if (contactDetails && data.contact) {
      const rows = [];
      if (data.contact.email) {
        rows.push(`<div class="item"><strong>Email</strong><a href="mailto:${data.contact.email}">${data.contact.email}</a></div>`);
      }
      if (data.contact.phone) {
        rows.push(`<div class="item"><strong>Phone</strong><span>${data.contact.phone}</span></div>`);
      }
      if (data.contact.address) {
        rows.push(`<div class="item"><strong>Address</strong><span>${data.contact.address}</span></div>`);
      }
      contactDetails.innerHTML = rows.join("");
    }
  });
