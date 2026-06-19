async function loadHeader() {
    try {
      const response = await fetch('header.html');
      const headerHtml = await response.text();

      // Create a safe temporary container node
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = headerHtml;

      // Grab the actual header node and prepend it to the body
      const headerNode = tempContainer.querySelector('header');
      document.body.prepend(headerNode);
    } catch (error) {
      console.error('Error loading the global header component:', error);
    }
  }

  // Fire the loader immediately when the script runs
  loadHeader();