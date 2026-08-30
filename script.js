/* =========================================================================
   Phubordin Phanyosri — Data Analyst Portfolio
   โครงสร้างหน้าเว็บทั้งหมด (nav, ปุ่มต่างๆ, TOC) ถูกสร้างจากไฟล์นี้ที่เดียว
   เพิ่ม/แก้โปรเจกต์ใหม่ → แก้แค่ NAV ด้านล่างนี้ ทุกหน้าอัปเดตตามทันที
   ========================================================================= */

const PAGE = location.pathname.split("/").pop() || "index.html";

/* ไอคอนประกอบชื่อเมนู */
const ic = (file, w = 25) => `<img src="${file}" style="vertical-align:middle" width="${w}">`;

/* --- เมนูหลัก : [ไฟล์, ชื่อ, (เมนูย่อย)] — เรียงจากใหม่ไปเก่า --- */
const NAV = [
    ["index.html", "🏠 Home"],
    ["about.html", "About Me"],
    ["experience.html", "Work Experience", [
        ["experience_mmt.html", `${ic("mmt_logo.jpg", 35)} มิตรไมตรีการแพทย์`],
        ["experience_leowood.html", `${ic("leowood_logo.png", 35)} Leowood Intertrade Co Ltd.`],
    ]],
    ["project.html", "Project Overview", [
        ["p13_pokemon_card.html", `⭐️ P13 : Pokemon Card - Skooldio Project`],
        ["project_mini_xml_cafe.html", `mini P12 : Cafe Menu Data Structure with ${ic("xml.png")} XML`],
        ["project_mini_api_py.html", `mini P11 : Extracting Public API Data with ${ic("python.png")} Python: Air Quality Analytics`],
        ["project_atm_oop_py_dsb10.html", `P10 : Object-Oriented ATM System: Financial Transactions with ${ic("python.png")} Python OOP`],
        ["project_pizza_chatbot_dsb10.html", `P9 : Chatbot Development for a Pizza Business Using ${ic("R.png")} R Programming`],
        ["project_looker_dsb10.html", `⭐️ P8 : Data-Driven Insights: Sales Performance & Profitability in ${ic("looker.png")}Looker Studio`],
        ["project_titanic_glm_dsb10.html", `⭐️ P7 : Titanic Survival Prediction: A Comparative Analysis of Classification Models ${ic("R.png")} R`],
        ["project_vizdimond_dsb10.html", `⭐️ P6 : EDA Visualization of the Diamond Dataset Using ${ic("R.png")} R and R Markdown`],
        ["project_nycflight13_23_dsb10.html", `⭐️ P5 : EDA and Comparison of NYC Flights Data (2013 vs. 2023) with ${ic("R.png")} R`],
        ["project_pyc_r_py_dsb10.html", `P4 : Creating a Multi-Round Rock-Paper-Scissors Game in ${ic("R.png")} R and ${ic("python.png")} Python`],
        ["project_rfm_py_dsb10.html", `⭐️ P3 : Customer Segmentation and RFM Analysis Using ${ic("python.png")}Python and ${ic("R.png")} R for Strategic Business Insight`],
        ["project_cafe_r_sql_dsb10.html", `P2 : Building a Café Restaurant Database Using ${ic("R.png")} R and ${ic("SQL.png")} SQL`],
        ["project_ggsheet_dsb10.html", `P1 : Data Exploration and Transformation with ${ic("sheets.png")} Google Sheets`],
    ]],
    ["certificate.html", "Certificates"],
    ["contact.html", "Contact"],
];

/* สร้าง <li> ของเมนู — หน้าปัจจุบันจะถูก highlight และคลิกแล้วเลื่อนขึ้นบนสุดแทนการโหลดซ้ำ */
function navHTML(isMobile) {
    return NAV.map(([href, label, sub], i) => {
        const here = href === PAGE || (sub && sub.some(([h]) => h === PAGE));
        const top = here
            ? `<a href="${href}" class="active" onclick="scrollToTop(event)">${label}</a>`
            : `<a href="${href}">${label}</a>`;

        let li;
        if (sub) {
            const items = sub.map(([h, l]) => `<li><a ${h === PAGE
                ? `class="active1" onclick="scrollToTop(event)"`
                : `href="${h}"`}>${l}</a></li>`).join("");
            li = `<li class="dropdown">${top}<ul class="dropdown-menu">${items}</ul></li>`;
        } else {
            li = `<li>${top}</li>`;
        }
        // เว้นบรรทัดคั่นกลุ่มเมนูบนมือถือ (เหมือนเดิม)
        return li + (isMobile && (i === 0 || i === 4) ? "<br>" : "");
    }).join("");
}

/* --- ประกอบส่วนประกอบคงที่ของทุกหน้า --- */
const TOC_MODE = document.body.dataset.toc || "flat";   // ไม่ใส่ = flat (เฉพาะ h2) | "deep" = ลงลึกถึง h4

document.body.insertAdjacentHTML("afterbegin", `
<div class="theme-switch-wrapper">
    <label class="switch"><input type="checkbox" id="theme-toggle"><span class="slider"></span><span class="switch-label"></span></label>
</div>
<div class="theme-switch1-wrapper" hidden>
    <label class="switch1" title="แสดง/ซ่อนสารบัญ"><input type="checkbox" id="toc-toggle"><span class="slider1"></span><span class="switch-label1"></span></label>
</div>
<button id="scrollToTopBtn" title="Go to top">⇧</button>
<button class="hamburger" id="hamburger" aria-haspopup="true" aria-controls="mobileMenu" aria-expanded="false" aria-label="เปิดเมนู">≡</button>
<aside id="table-of-contents" aria-label="สารบัญในหน้านี้">
    <h3 class="link-cursor">สารบัญ</h3>
    <ul id="${TOC_MODE === "deep" ? "toc-list1" : "toc-list"}"></ul>
</aside>
<div id="mobileMenu" class="mobile-panel" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="panel-inner">
        <button class="close-btn" id="closeBtn" aria-label="ปิดเมนู">✕</button>
        <nav aria-label="เมนูมือถือ"><ul>${navHTML(true)}</ul></nav>
    </div>
</div>`);

const primaryNav = document.querySelector("nav.primary");
if (primaryNav) {
    primaryNav.innerHTML = `<ul>${navHTML(false)}</ul>`;

    // แถบเมนูลอยอยู่บนสุด (position:fixed) จึงต้องบอก CSS ว่าสูงเท่าไร
    // เพื่อเว้นที่ให้เนื้อหาและวางปุ่มมุมขวาให้พอดี — ความสูงเปลี่ยนได้ถ้าเมนูตัดบรรทัด
    const syncNavHeight = () => {
        const h = primaryNav.offsetHeight;   // 0 เมื่อจอเล็กจน nav ถูกซ่อน
        document.documentElement.style.setProperty("--nav-h", h + "px");
    };
    syncNavHeight();
    addEventListener("resize", syncNavHeight);
    addEventListener("load", syncNavHeight);
    if (window.ResizeObserver) new ResizeObserver(syncNavHeight).observe(primaryNav);
}

/* ใช้กับลิงก์ "Read More" ในเนื้อหาหน้า */
function go(page) {
    if (window.event) window.event.stopPropagation();
    location.href = page;
}

function scrollToTop(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================================
   ธีมมืด/สว่าง + เบลอพื้นหลัง (จำค่าไว้ใน localStorage)
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");

    // ปิด transition ชั่วคราวตอนสลับธีม กันสีค้างและกันกระพริบ
    function withoutTransition(fn) {
        document.body.classList.add("no-transition");
        fn();
        requestAnimationFrame(() => requestAnimationFrame(
            () => document.body.classList.remove("no-transition")));
    }

    // ใส่คลาสไว้บน <html> ให้ตรงกับสคริปต์ใน <head> ที่ทำงานก่อนเบราว์เซอร์วาดหน้า
    function setTheme(isDark) {
        withoutTransition(() => document.documentElement.classList.toggle("dark-mode", isDark));
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }

    // สถานะถูกตั้งไว้แล้วโดยสคริปต์ใน <head> (ค่าเริ่มต้น = มืด)
    const isDark = document.documentElement.classList.contains("dark-mode");
    if (themeToggle) {
        themeToggle.checked = isDark;
        themeToggle.addEventListener("change", function () { setTheme(this.checked); });
    }

});

/* =========================================================================
   TOC ด้านข้าง — ตามหัวข้อใน <section> พร้อม highlight ตามการ scroll
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const toc = document.getElementById("table-of-contents");
    const tocList = document.getElementById("toc-list") || document.getElementById("toc-list1");
    if (!toc || !tocList) return;

    const deep = tocList.id === "toc-list1";
    const headings = document.querySelectorAll(deep ? "section h2, section h3, section h4" : "section h2");

    // หน้าที่มีหัวข้อน้อยเกินไป ไม่ต้องมีสารบัญและไม่ต้องมีสวิตช์
    if (headings.length < 2) { toc.remove(); return; }
    const switchWrap = document.querySelector(".theme-switch1-wrapper");
    if (switchWrap) switchWrap.hidden = false;

    const tocLinks = [];
    headings.forEach((heading, index) => {
        heading.id = `section-${index}`;

        const link = document.createElement("a");
        link.href = `#section-${index}`;
        // เก็บกวาดข้อความหัวข้อ: ตัดขีดคั่น/ช่องว่างที่ติดมาจาก markup
        link.textContent = heading.textContent.replace(/\s+/g, " ").replace(/^[\s|·:–-]+/, "").trim();
        link.addEventListener("click", function (event) {
            event.preventDefault();
            heading.scrollIntoView({ behavior: "smooth", block: "center" });
            tocLinks.forEach(l => l.classList.remove("highlighted"));
            link.classList.add("highlighted");
        });

        const item = document.createElement("li");
        item.appendChild(link);
        tocList.appendChild(item);
        tocLinks.push(link);
    });

    function updateTOCHighlight() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        let current = -1;
        headings.forEach((heading, index) => {
            const parent = heading.closest("section");
            if (!parent) return;
            if (scrollPosition >= parent.offsetTop - window.innerHeight * 0.55 &&
                scrollPosition < parent.offsetTop + parent.offsetHeight) current = index;
        });
        tocLinks.forEach((link, i) => link.classList.toggle("highlighted", i === current));
    }

    document.querySelectorAll("details").forEach(d => d.addEventListener("toggle", updateTOCHighlight));
    window.addEventListener("scroll", updateTOCHighlight, { passive: true });
    window.addEventListener("resize", updateTOCHighlight);
    setTimeout(updateTOCHighlight, 50);

    // สวิตช์ข้างปุ่มธีม : เปิด/ปิดสารบัญ และจำค่าไว้
    const toggle = document.getElementById("toc-toggle");
    const hidden = localStorage.getItem("tocHidden") === "1";
    toc.classList.toggle("hidden", hidden);
    if (toggle) {
        toggle.checked = !hidden;
        toggle.addEventListener("change", function () {
            toc.classList.toggle("hidden", !this.checked);
            localStorage.setItem("tocHidden", this.checked ? "0" : "1");
        });
    }

});

/* =========================================================================
   TOC ในหน้า — #toc-section (ซ้อนชั้น h2-h4) หรือ #toc-section1 (เฉพาะ h2)
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const nested = document.getElementById("toc-section");
    const target = nested || document.getElementById("toc-section1");
    if (!target) return;

    const headings = document.querySelectorAll(nested ? "h2, h3, h4" : "h2");
    const tocList = document.createElement("ul");
    let lastH2 = null, lastH3 = null;

    headings.forEach((heading, index) => {
        heading.id = heading.id || `heading-${index}`;

        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener("click", function (event) {
            event.preventDefault();
            window.scrollTo({
                top: heading.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2,
                behavior: "smooth"
            });
        });

        const item = document.createElement("li");
        item.appendChild(link);

        // จัดชั้น h3 ไว้ใต้ h2 และ h4 ไว้ใต้ h3
        const parent = heading.tagName === "H3" && lastH2 ? lastH2
            : heading.tagName === "H4" && lastH3 ? lastH3 : null;
        if (parent) {
            let subList = parent.querySelector("ul");
            if (!subList) { subList = document.createElement("ul"); parent.appendChild(subList); }
            subList.appendChild(item);
            if (heading.tagName === "H3") lastH3 = item;
        } else if (heading.tagName === "H2") {
            tocList.appendChild(item);
            lastH2 = item;
            lastH3 = null;
        }
    });

    target.appendChild(tocList);
});

/* =========================================================================
   ตัวเลขที่ต้องอัปเดตตามเวลา — คำนวณจากวันที่วันนี้ ไม่ต้องกลับมาแก้เอง
   data-birth="YYYY-MM-DD" -> อายุ   |   data-since="YYYY-MM" -> อายุงาน
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const now = new Date();

    // อายุ — นับจากวันเกิด ถ้ายังไม่ถึงวันเกิดปีนี้ก็ลบออกหนึ่งปี
    document.querySelectorAll("[data-birth]").forEach(el => {
        const b = new Date(el.dataset.birth);
        let age = now.getFullYear() - b.getFullYear();
        const m = now.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
        el.textContent = age;
    });

    document.querySelectorAll("[data-since]").forEach(el => {
        const [y, m] = el.dataset.since.split("-").map(Number);
        const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
        if (months < 1) return;
        const years = Math.floor(months / 12), rest = months % 12;
        const text = years
            ? `${years} yr${years > 1 ? "s" : ""}${rest ? ` ${rest} mo${rest > 1 ? "s" : ""}` : ""}`
            : `${months} month${months > 1 ? "s" : ""}`;
        el.textContent = `${el.textContent.trim()} (${text})`;
    });
});

/* =========================================================================
   ปุ่มเลื่อนขึ้นบนสุด
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("scrollToTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", function () {
        btn.classList.toggle("show", window.scrollY > 200);
    });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});

/* =========================================================================
   เมนูมือถือ (hamburger)
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeBtn = document.getElementById("closeBtn");
    if (!hamburger || !mobileMenu || !closeBtn) return;

    function openMenu() {
        mobileMenu.classList.add("open");
        mobileMenu.setAttribute("aria-hidden", "false");
        hamburger.setAttribute("aria-expanded", "true");
        closeBtn.focus();
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.focus();
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", () => {
        hamburger.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });
    closeBtn.addEventListener("click", closeMenu);
    mobileMenu.addEventListener("click", e => { if (e.target === mobileMenu) closeMenu(); });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && mobileMenu.classList.contains("open")) closeMenu();
    });

    // แตะหัวข้อที่มีเมนูย่อยบนมือถือ = กาง/พับ แทนการเปิดลิงก์
    if (window.innerWidth <= 768) {
        document.querySelectorAll("nav ul li > a").forEach(link => {
            link.addEventListener("click", function (e) {
                const li = this.parentElement;
                if (!li.querySelector(".dropdown-menu")) return;
                e.preventDefault();
                document.querySelectorAll("nav ul li").forEach(o => { if (o !== li) o.classList.remove("open"); });
                li.classList.toggle("open");
            });
        });
    }
});

/* =========================================================================
   รูปพรีวิวตอนชี้เมาส์ + คัดลอกอีเมล/โค้ด + toast
   ========================================================================= */
const previewImage = document.createElement("img");
previewImage.classList.add("preview");
document.body.appendChild(previewImage);

function showPreview(event, src) {
    previewImage.src = src;
    previewImage.style.display = "block";
    previewImage.style.left = event.pageX + 15 + "px";
    previewImage.style.top = event.pageY - 250 + "px";
}

function hidePreview() {
    previewImage.style.display = "none";
}

function showToast(toast) {
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function copyEmail() {
    const email = document.getElementById("email").textContent.trim();
    navigator.clipboard.writeText(email).then(() => showToast(document.getElementById("toast-copy")));
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".code-container").forEach(container => {
        const copyBtn = container.querySelector(".copy-btn");
        const codeBlock = container.querySelector("code");
        const toast = container.querySelector(".toast");
        if (!copyBtn || !codeBlock || !toast) return;

        codeBlock.textContent = codeBlock.textContent.trim();
        copyBtn.addEventListener("click", function () {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => showToast(toast));
        });
        if (window.Prism) Prism.highlightElement(codeBlock);
    });

    // <details class="detail1"> ให้กางไว้ตั้งแต่แรก
    document.querySelectorAll(".detail1").forEach(d => d.setAttribute("open", "true"));
});

/* =========================================================================
   Lightbox — กดที่รูปไหนก็ได้เพื่อดูเต็มจอ
   เลื่อนดูรูปอื่นในหน้าเดียวกันได้ด้วยลูกศร ← → , Esc เพื่อปิด
   ========================================================================= */
function openGalleryModal(src) {
    // รวบรวมรูปทั้งหมดในหน้านี้ที่กดดูได้ เพื่อทำปุ่มก่อนหน้า/ถัดไป
    const items = [...document.querySelectorAll('[onclick*="openGalleryModal"]')]
        .map(el => {
            const m = /openGalleryModal\(\s*['"]([^'"]+)['"]/.exec(el.getAttribute("onclick") || "");
            if (!m) return null;
            const img = el.tagName === "IMG" ? el : el.querySelector("img");
            // ไม่มี alt ก็ใช้ชื่อหัวข้อของ section ที่รูปอยู่ เพื่อให้รู้ว่ากำลังดูรูปอะไร
            const near = el.closest("section")?.querySelector("h2, h3");
            const caption = (img && img.alt) || el.textContent.trim() || (near ? near.textContent.trim() : "");
            return { src: m[1], caption: caption.replace(/\s+/g, " ").slice(0, 110) };
        })
        .filter(Boolean)
        .filter((v, i, a) => a.findIndex(x => x.src === v.src) === i);   // ตัดรูปซ้ำ

    let i = Math.max(0, items.findIndex(x => x.src === src));
    if (!items.length) items.push({ src, caption: "" });

    const modal = document.createElement("div");
    modal.className = "gallery-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
        <div class="lb-stage">
            <button class="close-modal" aria-label="ปิด">&times;</button>
            <button class="lb-nav lb-prev" aria-label="รูปก่อนหน้า">&#8249;</button>
            <img class="full-image" src="${items[i].src}" alt="">
            <button class="lb-nav lb-next" aria-label="รูปถัดไป">&#8250;</button>
        </div>
        <div class="lb-bar">
            <div class="lb-meta">
                <span class="lb-caption"></span>
                <span class="lb-count"></span>
            </div>
            <div class="lb-tools">
                <button class="lb-btn lb-zoom">🔍 ขนาดจริง</button>
                <a class="lb-btn lb-open" target="_blank" rel="noopener">↗ เปิดไฟล์</a>
            </div>
        </div>`;

    const img = modal.querySelector(".full-image");
    const cap = modal.querySelector(".lb-caption");
    const count = modal.querySelector(".lb-count");
    const zoomBtn = modal.querySelector(".lb-zoom");
    const openLink = modal.querySelector(".lb-open");
    const many = items.length > 1;
    modal.querySelector(".lb-prev").hidden = !many;
    modal.querySelector(".lb-next").hidden = !many;

    function show(n) {
        i = (n + items.length) % items.length;
        modal.classList.remove("zoomed");
        zoomBtn.textContent = "🔍 ขนาดจริง";
        img.src = items[i].src;
        cap.textContent = items[i].caption || "";
        count.textContent = many ? `${i + 1} / ${items.length}` : "";
        openLink.href = items[i].src;
        // เล่นอนิเมชันซ้ำทุกครั้งที่เปลี่ยนรูป
        img.style.animation = "none";
        void img.offsetWidth;
        img.style.animation = "";
    }

    function toggleZoom() {
        const on = modal.classList.toggle("zoomed");
        zoomBtn.textContent = on ? "🔍 พอดีจอ" : "🔍 ขนาดจริง";
    }

    function close() {
        modal.classList.add("closing");
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
        setTimeout(() => modal.remove(), 150);
    }

    function onKey(e) {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft" && many) show(i - 1);
        else if (e.key === "ArrowRight" && many) show(i + 1);
    }

    modal.querySelector(".close-modal").addEventListener("click", close);
    modal.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); show(i - 1); });
    modal.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); show(i + 1); });
    zoomBtn.addEventListener("click", toggleZoom);
    img.addEventListener("click", e => { e.stopPropagation(); toggleZoom(); });
    // กดพื้นที่ว่างรอบรูปเพื่อปิด
    modal.querySelector(".lb-stage").addEventListener("click", e => {
        if (e.target === e.currentTarget) close();
    });
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";   // ล็อกไม่ให้หน้าข้างหลังเลื่อน
    document.body.appendChild(modal);
    show(i);
}

/* =========================================================================
   ตารางกว้างเกินจอ → ใส่กรอบเลื่อนแนวนอนให้อัตโนมัติ
   ========================================================================= */
document.querySelectorAll("table").forEach(function (table) {
    if (table.parentElement.classList.contains("table-container")) return;
    const wrapper = document.createElement("div");
    wrapper.className = "table-container";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
});

/* =========================================================================
   เลื่อนไปยังโปรเจกต์ที่ระบุใน URL เช่น project.html#name-project8
   ========================================================================= */
window.addEventListener("DOMContentLoaded", function () {
    if (!location.hash.startsWith("#name-project")) return;
    const target = document.querySelector(location.hash);
    if (!target) return;
    setTimeout(() => {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 340, behavior: "smooth" });
    }, 100);
});

/* =========================================================================
   Mermaid diagram (เฉพาะหน้าที่โหลด mermaid.min.js)
   ========================================================================= */
document.addEventListener("DOMContentLoaded", function () {
    if (typeof mermaid === "undefined") return;

    mermaid.initialize({ startOnLoad: false, theme: "default", flowchart: { curve: "basis" } });

    function renderMermaids() {
        document.querySelectorAll(".mermaid:not(.rendered)").forEach(el => {
            el.innerHTML = el.textContent.split("\n").map(l => l.trimStart()).join("\n").trim();
            el.classList.add("rendered");
        });
        mermaid.run().catch(err => console.error("Mermaid run failed:", err));
    }

    renderMermaids();

    // แผนภาพที่อยู่ใน <details> ต้อง render ใหม่ตอนกาง
    document.querySelectorAll("details").forEach(detail => {
        detail.addEventListener("toggle", () => {
            if (detail.open) setTimeout(() => requestAnimationFrame(renderMermaids), 500);
        });
    });
});
