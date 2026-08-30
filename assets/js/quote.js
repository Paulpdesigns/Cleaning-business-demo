/* ============================================================
   QUOTE.JS — multi-step quote calculator
   All prices come from pricingConfig in config.js.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-quote-wizard]");
  if (!root) return;
  new QuoteWizard(root);
});

const SERVICE_OPTIONS = [
  { id: "regular", label: "Regular Cleaning", icon: "sparkle" },
  { id: "deep", label: "Deep Cleaning", icon: "star" },
  { id: "endOfTenancy", label: "End of Tenancy", icon: "key" },
  { id: "moveInOut", label: "Move-In / Move-Out", icon: "box" },
  { id: "office", label: "Office Cleaning", icon: "building" },
  { id: "airbnb", label: "Airbnb Cleaning", icon: "home" }
];

const PROPERTY_OPTIONS = [
  { id: "flat", label: "Flat / Apartment" },
  { id: "house", label: "House" },
  { id: "office", label: "Office" },
  { id: "commercial", label: "Commercial Property" },
  { id: "airbnb", label: "Airbnb / Short-Let" }
];

const BEDROOM_OPTIONS = [
  { id: "studio", label: "Studio" },
  { id: "1", label: "1 Bed" },
  { id: "2", label: "2 Beds" },
  { id: "3", label: "3 Beds" },
  { id: "4", label: "4 Beds" },
  { id: "5plus", label: "5+ Beds" }
];

const BATHROOM_OPTIONS = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4plus", label: "4+" }
];

const OFFICE_SIZE_OPTIONS = [
  { id: "small", label: "Small Office", sub: "Up to 500 sq ft" },
  { id: "medium", label: "Medium Office", sub: "500–1500 sq ft" },
  { id: "large", label: "Large Office", sub: "1500–3000 sq ft" },
  { id: "custom", label: "Larger / Custom", sub: "3000+ sq ft" }
];

const FREQUENCY_OPTIONS = [
  { id: "oneOff", label: "One-Off", sub: "" },
  { id: "weekly", label: "Weekly", sub: "Save 15%" },
  { id: "fortnightly", label: "Fortnightly", sub: "Save 10%" },
  { id: "monthly", label: "Monthly", sub: "Save 5%" }
];

const ADDON_OPTIONS = [
  { id: "insideOven", label: "Inside Oven" },
  { id: "insideFridge", label: "Inside Fridge" },
  { id: "interiorWindows", label: "Interior Windows" },
  { id: "insideCabinets", label: "Inside Cabinets" },
  { id: "carpetCleaning", label: "Carpet Cleaning" },
  { id: "upholstery", label: "Upholstery Cleaning" },
  { id: "laundry", label: "Laundry" },
  { id: "ironing", label: "Ironing" },
  { id: "balcony", label: "Balcony Cleaning" },
  { id: "additionalBathroom", label: "Additional Bathroom" }
];

class QuoteWizard {
  constructor(root) {
    this.root = root;
    this.progressFill = root.querySelector("[data-progress-fill]");
    this.progressLabel = root.querySelector("[data-progress-label]");
    this.body = root.querySelector("[data-quote-body]");
    this.footer = root.querySelector("[data-quote-footer]");

    this.state = {
      service: null,
      property: null,
      bedrooms: null,
      bathrooms: null,
      officeSize: null,
      frequency: null,
      addons: [],
      details: { name: "", email: "", phone: "", postcode: "", date: "", time: "", message: "" }
    };

    this.stepIndex = 0;
    this.buildSteps();
    this.render();
  }

  buildSteps() {
    // Step 3 is conditional on property/service type, resolved at render time.
    this.steps = ["service", "property", "size", "frequency", "extras", "quote"];
  }

  isCommercialFlow() {
    return this.state.service === "office" || this.state.property === "office" || this.state.property === "commercial";
  }

  currentStepKey() { return this.steps[this.stepIndex]; }

  goNext() {
    if (!this.validateStep()) return;
    if (this.stepIndex < this.steps.length - 1) {
      this.stepIndex++;
      this.render();
      this.scrollIntoView();
    }
  }

  goBack() {
    if (this.stepIndex > 0) {
      this.stepIndex--;
      this.render();
      this.scrollIntoView();
    }
  }

  scrollIntoView() {
    this.root.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  validateStep() {
    const key = this.currentStepKey();
    if (key === "service" && !this.state.service) return this.flash("Please choose a service to continue.");
    if (key === "property" && !this.state.property) return this.flash("Please choose a property type to continue.");
    if (key === "size") {
      if (this.isCommercialFlow()) {
        if (!this.state.officeSize) return this.flash("Please choose an approximate size.");
      } else {
        if (!this.state.bedrooms || !this.state.bathrooms) return this.flash("Please choose bedrooms and bathrooms.");
      }
    }
    if (key === "frequency" && !this.state.frequency) return this.flash("Please choose how often you'd like cleaning.");
    return true;
  }

  flash(message) {
    let el = this.root.querySelector(".quote-flash");
    if (!el) {
      el = document.createElement("div");
      el.className = "quote-flash field__error";
      el.style.cssText = "display:block;text-align:center;margin-bottom:12px;";
      this.body.querySelector(".quote-step.is-active").prepend(el);
    }
    el.textContent = message;
    return false;
  }

  updateProgress() {
    const total = this.steps.length;
    const current = this.stepIndex + 1;
    this.progressFill.style.width = (current / total) * 100 + "%";
    this.progressLabel.textContent = `Step ${current} of ${total}`;
  }

  render() {
    this.updateProgress();
    const key = this.currentStepKey();
    this.body.innerHTML = this.renderStep(key);
    this.footer.innerHTML = this.renderFooter(key);
    this.bindStepEvents(key);
    this.bindFooterEvents(key);
  }

  renderStep(key) {
    switch (key) {
      case "service": return this.renderService();
      case "property": return this.renderProperty();
      case "size": return this.isCommercialFlow() ? this.renderOfficeSize() : this.renderResidentialSize();
      case "frequency": return this.renderFrequency();
      case "extras": return this.renderExtras();
      case "quote": return this.renderQuote();
      default: return "";
    }
  }

  renderFooter(key) {
    const isFirst = this.stepIndex === 0;
    const isLast = key === "quote";
    if (isLast) return "";
    return `
      <button class="btn btn--ghost btn--back" data-action="back" ${isFirst ? "disabled" : ""}>Back</button>
      <button class="btn btn--primary" data-action="next">Continue</button>
    `;
  }

  bindFooterEvents() {
    const back = this.footer.querySelector('[data-action="back"]');
    const next = this.footer.querySelector('[data-action="next"]');
    back && back.addEventListener("click", () => this.goBack());
    next && next.addEventListener("click", () => this.goNext());
  }

  /* ---- Step renderers ---- */

  renderService() {
    return `
      <div class="quote-step is-active">
        <h3>What kind of clean do you need?</h3>
        <p class="quote-step__hint">Choose the service that best matches what you're after.</p>
        <div class="option-grid">
          ${SERVICE_OPTIONS.map(o => `
            <button class="option-card ${this.state.service === o.id ? "is-active" : ""}" data-select="service" data-value="${o.id}">
              <span class="option-card__label">${o.label}</span>
            </button>
          `).join("")}
        </div>
      </div>`;
  }

  renderProperty() {
    return `
      <div class="quote-step is-active">
        <h3>What type of property is it?</h3>
        <p class="quote-step__hint">This helps us tailor the estimate to your space.</p>
        <div class="option-grid option-grid--2">
          ${PROPERTY_OPTIONS.map(o => `
            <button class="option-card ${this.state.property === o.id ? "is-active" : ""}" data-select="property" data-value="${o.id}">
              <span class="option-card__label">${o.label}</span>
            </button>
          `).join("")}
        </div>
      </div>`;
  }

  renderResidentialSize() {
    return `
      <div class="quote-step is-active">
        <h3>How big is the property?</h3>
        <p class="quote-step__hint">Bedrooms and bathrooms — this is the biggest factor in the price.</p>
        <p style="font-weight:600;color:var(--primary);font-size:0.88rem;margin-bottom:10px;">Bedrooms</p>
        <div class="option-grid option-grid--4" data-group="bedrooms">
          ${BEDROOM_OPTIONS.map(o => `
            <button class="option-card ${this.state.bedrooms === o.id ? "is-active" : ""}" data-select="bedrooms" data-value="${o.id}">
              <span class="option-card__label">${o.label}</span>
            </button>
          `).join("")}
        </div>
        <p style="font-weight:600;color:var(--primary);font-size:0.88rem;margin:22px 0 10px;">Bathrooms</p>
        <div class="option-grid option-grid--4" data-group="bathrooms">
          ${BATHROOM_OPTIONS.map(o => `
            <button class="option-card ${this.state.bathrooms === o.id ? "is-active" : ""}" data-select="bathrooms" data-value="${o.id}">
              <span class="option-card__label">${o.label}</span>
            </button>
          `).join("")}
        </div>
      </div>`;
  }

  renderOfficeSize() {
    return `
      <div class="quote-step is-active">
        <h3>What's the approximate floor size?</h3>
        <p class="quote-step__hint">A rough estimate is fine — we'll confirm exact pricing on-site.</p>
        <div class="option-grid option-grid--2">
          ${OFFICE_SIZE_OPTIONS.map(o => `
            <button class="option-card ${this.state.officeSize === o.id ? "is-active" : ""}" data-select="officeSize" data-value="${o.id}">
              <span class="option-card__label">${o.label}</span>
              ${o.sub ? `<span class="option-card__sub" style="color:var(--text-muted);">${o.sub}</span>` : ""}
            </button>
          `).join("")}
        </div>
      </div>`;
  }

  renderFrequency() {
    return `
      <div class="quote-step is-active">
        <h3>How often would you like us to clean?</h3>
        <p class="quote-step__hint">Recurring bookings come with a discount built into your estimate.</p>
        <div class="option-grid option-grid--4">
          ${FREQUENCY_OPTIONS.map(o => `
            <button class="option-card ${this.state.frequency === o.id ? "is-active" : ""}" data-select="frequency" data-value="${o.id}">
              <span class="option-card__label">${o.label}</span>
              ${o.sub ? `<span class="option-card__sub">${o.sub}</span>` : ""}
            </button>
          `).join("")}
        </div>
      </div>`;
  }

  renderExtras() {
    return `
      <div class="quote-step is-active">
        <h3>Any extras you'd like added?</h3>
        <p class="quote-step__hint">Optional — skip this step if you just want the standard clean.</p>
        <div class="checkbox-list">
          ${ADDON_OPTIONS.map(o => `
            <div class="checkbox-row ${this.state.addons.includes(o.id) ? "is-active" : ""}" data-addon-row="${o.id}">
              <span class="checkbox-row__label">${o.label}</span>
              <span style="display:flex;align-items:center;gap:14px;">
                <span class="checkbox-row__price">+${pricingConfig.currencySymbol}${pricingConfig.addons[o.id]}</span>
                <button class="toggle ${this.state.addons.includes(o.id) ? "is-on" : ""}" data-addon-toggle="${o.id}" aria-label="Toggle ${o.label}"></button>
              </span>
            </div>
          `).join("")}
        </div>
      </div>`;
  }

  renderQuote() {
    const { low, high, duration } = this.calculatePrice();
    const sym = pricingConfig.currencySymbol;
    if (this.submitted) {
      return `
        <div class="quote-step is-active">
          <div class="quote-success">
            <div class="quote-success__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3>Thanks — your quote request is in!</h3>
            <p>We'll be in touch shortly at the details you provided to confirm your booking.</p>
            <button class="btn btn--dark" data-action="restart" style="margin-top:12px;">Start a new quote</button>
          </div>
        </div>`;
    }
    return `
      <div class="quote-step is-active">
        <div class="quote-summary">
          <p class="eyebrow" style="margin:0;">Your Estimated Quote</p>
          <div class="quote-summary__price">${sym}${low}–${sym}${high}</div>
          <p style="font-size:0.86rem;color:var(--text-muted);">Estimated visit time: ~${duration}</p>
        </div>
        <ul class="quote-summary__list">
          <li><span>Service</span><span>${this.labelFor(SERVICE_OPTIONS, this.state.service)}</span></li>
          <li><span>Property</span><span>${this.labelFor(PROPERTY_OPTIONS, this.state.property)}</span></li>
          ${this.isCommercialFlow()
            ? `<li><span>Size</span><span>${this.labelFor(OFFICE_SIZE_OPTIONS, this.state.officeSize)}</span></li>`
            : `<li><span>Bedrooms</span><span>${this.labelFor(BEDROOM_OPTIONS, this.state.bedrooms)}</span></li>
               <li><span>Bathrooms</span><span>${this.labelFor(BATHROOM_OPTIONS, this.state.bathrooms)}</span></li>`
          }
          <li><span>Frequency</span><span>${this.labelFor(FREQUENCY_OPTIONS, this.state.frequency)}</span></li>
          <li><span>Extras</span><span>${this.state.addons.length ? this.state.addons.map(a => this.labelFor(ADDON_OPTIONS, a)).join(", ") : "None"}</span></li>
        </ul>
        <p class="quote-summary__disclaimer">This is an estimated quotation. Final pricing may vary depending on the condition and specific requirements of the property.</p>

        <h3 style="margin-top:28px;">Your details</h3>
        <p class="quote-step__hint">So we can confirm your booking.</p>
        <form data-details-form novalidate>
          <div class="field-row">
            <div class="field" data-field="name"><label>Full name</label><input type="text" name="name" required></div>
            <div class="field" data-field="email"><label>Email address</label><input type="email" name="email" required></div>
          </div>
          <div class="field-row">
            <div class="field" data-field="phone"><label>Telephone number</label><input type="tel" name="phone" required></div>
            <div class="field" data-field="postcode"><label>${businessConfig.postcodeLabel}</label><input type="text" name="postcode" required></div>
          </div>
          <div class="field-row">
            <div class="field" data-field="date"><label>Preferred date</label><input type="date" name="date"></div>
            <div class="field" data-field="time"><label>Preferred time</label><input type="time" name="time"></div>
          </div>
          <div class="field"><label>Additional instructions (optional)</label><textarea name="message" rows="3"></textarea></div>
        </form>
      </div>`;
  }

  labelFor(list, id) {
    const found = list.find(o => o.id === id);
    return found ? found.label : "—";
  }

  calculatePrice() {
    let subtotal = 0;
    const p = pricingConfig;

    if (this.isCommercialFlow()) {
      subtotal += p.servicePrices[this.state.service] || p.servicePrices.office;
      subtotal += p.officeSizePrices[this.state.officeSize] || 0;
    } else {
      subtotal += p.servicePrices[this.state.service] || p.servicePrices.regular;
      subtotal += p.bedroomPrices[this.state.bedrooms] || 0;
      subtotal += p.bathroomPrices[this.state.bathrooms] || 0;
    }

    subtotal *= p.propertyAdjustments[this.state.property] || 1;

    this.state.addons.forEach(a => { subtotal += p.addons[a] || 0; });

    const discount = p.frequencyDiscounts[this.state.frequency] || 0;
    subtotal = subtotal * (1 - discount);

    const low = Math.round(subtotal * p.estimateRange[0]);
    const high = Math.round(subtotal * p.estimateRange[1]);

    let minutes = p.baseDurationMinutes;
    if (!this.isCommercialFlow()) {
      const bedroomIndex = BEDROOM_OPTIONS.findIndex(o => o.id === this.state.bedrooms);
      minutes += Math.max(0, bedroomIndex) * p.perBedroomMinutes;
    }
    minutes += this.state.addons.length * p.perExtraMinutes;
    const duration = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? (minutes % 60) + "m" : ""}`.trim() : `${minutes}m`;

    return { low: Math.max(low, 1), high: Math.max(high, low + 5), duration };
  }

  bindStepEvents(key) {
    this.root.querySelectorAll("[data-select]").forEach(btn => {
      btn.addEventListener("click", () => {
        const field = btn.dataset.select;
        this.state[field] = btn.dataset.value;
        // Reset dependent state when service/property changes flow type
        if (field === "service" || field === "property") {
          this.state.bedrooms = null;
          this.state.bathrooms = null;
          this.state.officeSize = null;
        }
        this.render();
      });
    });

    this.root.querySelectorAll("[data-addon-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.addonToggle;
        const idx = this.state.addons.indexOf(id);
        if (idx > -1) this.state.addons.splice(idx, 1); else this.state.addons.push(id);
        this.render();
      });
    });

    if (key === "quote") {
      const restart = this.root.querySelector('[data-action="restart"]');
      restart && restart.addEventListener("click", () => {
        this.submitted = false;
        this.stepIndex = 0;
        this.state = { service: null, property: null, bedrooms: null, bathrooms: null, officeSize: null, frequency: null, addons: [], details: {} };
        this.render();
      });

      const form = this.root.querySelector("[data-details-form]");
      if (form) {
        this.footer.innerHTML = `<button class="btn btn--ghost btn--back" data-action="back">Back</button><button class="btn btn--primary" data-action="submit">Request This Quote</button>`;
        this.footer.querySelector('[data-action="back"]').addEventListener("click", () => this.goBack());
        this.footer.querySelector('[data-action="submit"]').addEventListener("click", () => this.submitDetails(form));
      }
    }
  }

  submitDetails(form) {
    const required = ["name", "email", "phone", "postcode"];
    let valid = true;
    required.forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      const fieldWrap = input.closest(".field");
      const ok = input.value.trim().length > 1 && (name !== "email" || input.value.includes("@"));
      fieldWrap.classList.toggle("has-error", !ok);
      if (!fieldWrap.querySelector(".field__error")) {
        const err = document.createElement("span");
        err.className = "field__error";
        err.textContent = name === "email" ? "Please enter a valid email address." : "This field is required.";
        fieldWrap.appendChild(err);
      }
      if (!ok) valid = false;
    });
    if (!valid) return;

    // Integration point: this is where a real backend submission happens.
    // See businessConfig.integrations in config.js — currently no endpoint
    // is configured, so this only records state locally and shows success.
    this.state.details = Object.fromEntries(new FormData(form).entries());
    this.submitted = true;
    this.render();
  }
}
