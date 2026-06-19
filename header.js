const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
  <header style="display: flex; justify-content: space-between; align-items: center; padding: 20px; ">
    <div class="logo-container">
      <a href="index.html" style="font-weight: bold; text-decoration: none; color: #333;">
        <img src="emotionalFeelingLogo.png" alt="James Milillo" class="logo-img"">
        <h1 class="logo-text">
            James Milillo<span class="domain">.com</span>
        </h1>
      </a>
    </div>
  </header>
`;

document.body.prepend(headerTemplate.content);
