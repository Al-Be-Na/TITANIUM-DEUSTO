/**
 * script.js
 * * Este script carga dinámicamente el contenido de una entrada de blog desde un archivo JSON
 * y lo renderiza en la página. Está diseñado para funcionar con la estructura de blog.json
 * y mostrar el artículo en una página HTML (como blog.html).
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elemento contenedor donde se renderizará el artículo del blog.
    // Asegúrate de que tu archivo blog.html tenga un <article id="blog-post-container"></article>
    const blogPostContainer = document.getElementById('blog-post-container');

    // Ruta al archivo JSON. Asegúrate de que esté en la misma carpeta o ajusta la ruta.
    const blogDataUrl = 'blog.json';

    /**
     * Función principal para cargar y mostrar el post del blog.
     */
    async function loadBlogPost() {
        // Si el contenedor no existe en la página, no continuamos.
        if (!blogPostContainer) {
            console.error('Error: El elemento contenedor con id "blog-post-container" no se encontró en el DOM.');
            return;
        }

        try {
            // Hacemos la petición para obtener el archivo JSON.
            const response = await fetch(blogDataUrl);
            
            // Verificamos si la petición fue exitosa.
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }

            // Convertimos la respuesta a formato JSON.
            const data = await response.json();
            
            // Renderizamos el contenido del post.
            renderPost(data.post);

        } catch (error) {
            // Mostramos un mensaje de error en la consola y en la página.
            console.error('No se pudo cargar el contenido del blog:', error);
            blogPostContainer.innerHTML = '<p class="text-center text-red-400">Lo sentimos, no se pudo cargar el artículo. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    /**
     * Renderiza el contenido del post en el DOM.
     * @param {object} post - El objeto del post que viene del JSON.
     */
    function renderPost(post) {
        // Limpiamos el contenedor por si tuviera contenido previo.
        blogPostContainer.innerHTML = '';

        // Creamos el fragmento del documento para mejorar el rendimiento.
        const fragment = document.createDocumentFragment();

        // 1. Creamos y añadimos la cabecera del artículo.
        const header = document.createElement('header');
        header.className = 'text-center mb-12';
        header.innerHTML = `
            <p class="text-sm text-gray-400">Publicado el ${new Date(post.publicationDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} por ${post.author}</p>
            <h1 class="text-4xl md:text-6xl font-black text-white uppercase tracking-wide mt-2">${post.title}</h1>
            <p class="mt-4 text-lg text-sky-400">${post.subtitle}</p>
        `;
        fragment.appendChild(header);

        // 2. Creamos el contenedor principal del contenido del artículo.
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg border border-gray-700 text-gray-300 leading-relaxed blog-content';

        // 3. Añadimos la imagen principal.
        const mainImage = document.createElement('img');
        mainImage.src = post.mainImageUrl;
        mainImage.alt = post.altText;
        mainImage.className = 'rounded-lg my-8 w-full h-auto';
        contentWrapper.appendChild(mainImage);
        
        // 4. Procesamos y añadimos el array de contenido.
        post.content.forEach(element => {
            let htmlElement;
            switch (element.type) {
                case 'heading':
                    htmlElement = document.createElement(`h${element.level}`);
                    htmlElement.textContent = element.text;
                    break;
                case 'paragraph':
                    htmlElement = document.createElement('p');
                    // Usamos innerHTML para interpretar las etiquetas <strong> o <em>
                    htmlElement.innerHTML = element.text; 
                    break;
                default:
                    // Si encontramos un tipo no reconocido, lo ignoramos.
                    return;
            }
            contentWrapper.appendChild(htmlElement);
        });

        fragment.appendChild(contentWrapper);

        // 5. Finalmente, añadimos todo el fragmento al contenedor principal en el DOM.
        blogPostContainer.appendChild(fragment);
    }

    // Iniciamos la carga del blog.
    loadBlogPost();
});
