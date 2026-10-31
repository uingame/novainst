function getField(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

function renderCards(listId, section) {
  const list = document.getElementById(listId);
  if (list && section && section.items) {
    list.innerHTML = section.items
      .map(
        (item) => `
        <div class="card">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>`
      )
      .join("");
  }
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

    const credentialsList = document.getElementById("credentials-list");
    if (credentialsList && data.credentials && data.credentials.items) {
      credentialsList.innerHTML = data.credentials.items
        .map((item) => `<li>${item.text}</li>`)
        .join("");
    }

    renderCards("programs-list", data.programs);
    renderCards("founder-list", data.founder);

    const companyList = document.getElementById("company-list");
    if (companyList && data.company && data.company.items) {
      companyList.innerHTML = data.company.items
        .map(
          (item) => `
        <div class="row">
          <strong>${item.label}</strong>
          <span>${item.value}</span>
        </div>`
        )
        .join("");
    }

    const contactDetails = document.getElementById("contact-details");
    if (contactDetails && data.contact) {
      const rows = [];
      if (data.contact.person) {
        rows.push(`<div class="item"><strong>Point of Contact</strong><span>${data.contact.person}</span></div>`);
      }
      if (data.contact.email) {
        rows.push(`<div class="item"><strong>Email</strong><a href="mailto:${data.contact.email}">${data.contact.email}</a></div>`);
      }
      if (data.contact.phone) {
        rows.push(`<div class="item"><strong>Phone</strong><a href="tel:${data.contact.phone.replace(/[^0-9+]/g, "")}">${data.contact.phone}</a></div>`);
      }
      if (data.contact.address) {
        rows.push(`<div class="item"><strong>Address</strong><span>${data.contact.address}</span></div>`);
      }
      contactDetails.innerHTML = rows.join("");
    }
  });
