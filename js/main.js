// Elliptical carousel functionality for skills section
document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelectorAll('.skill');
    const skillsContainer = document.querySelector('.skills ul');
    if (!skills.length || !skillsContainer) {
        console.error('Skills or container not found!');
        console.log('Available containers:', document.querySelectorAll('.skills'));
        return;
    }
    
    let angle = 0;
    let isAnimating = true; 
    const radiusX = 180; 
    const radiusY = 110;  
    
    
    setTimeout(() => {
        const centerX = skillsContainer.offsetWidth / 2;
        const centerY = skillsContainer.offsetHeight / 2;
        
        skillsContainer.style.position = 'relative';
        
        function updateSkillsPosition() {
            skills.forEach((skill, index) => {
                const skillAngle = angle + (index * (2 * Math.PI) / skills.length);
                

                const x = centerX + radiusX * Math.cos(skillAngle);
                const y = centerY + radiusY * Math.sin(skillAngle);
                

                skill.style.position = 'absolute';
                skill.style.left = `${x}px`;
                skill.style.top = `${y}px`;
                skill.style.transform = 'translate(-50%, -50%)';
                skill.style.transition = 'all 0.3s ease-in-out';
                

                const scale = 0.7 + 0.3 * ((y - centerY + radiusY) / (2 * radiusY));
                skill.style.transform += ` scale(${scale})`;
                

                const opacity = 0.4 + 0.6 * scale;
                skill.style.opacity = opacity;
                

                skill.style.zIndex = Math.floor(scale * 100);
            });
        }
        
        function rotateEllipse() {
            if (isAnimating) {
                angle += 0.01; 
                updateSkillsPosition();
            }
            if (isAnimating) {
                requestAnimationFrame(rotateEllipse);
            } else {
                setTimeout(() => {
                    if (isAnimating) {
                        requestAnimationFrame(rotateEllipse);
                    }
                }, 16);
            }
        }
        
        updateSkillsPosition();        
        rotateEllipse();
        
        // Variable para controlar el debounce
        let mouseTimeout;
        let isHoveringSkill = false;
        
        //Eventos solo en cada skill individual
        skills.forEach(skill => {
            skill.addEventListener("mouseenter", function (e) {

                clearTimeout(mouseTimeout);
                isHoveringSkill = true;
                isAnimating = false;
                
                // Capturar y fijar la posición actual de TODAS las skills
                skills.forEach(s => {
                    // Obtener la posición actual calculada (incluyendo cualquier transición en curso)
                    const computedStyle = window.getComputedStyle(s);
                    const currentLeft = computedStyle.left;
                    const currentTop = computedStyle.top;
                    const currentTransform = computedStyle.transform;
                    
                    // Desactivar transiciones ANTES de fijar la posición
                    s.style.transition = 'none';
                    
                    // Fijar la posición actual
                    s.style.left = currentLeft;
                    s.style.top = currentTop;
                    s.style.transform = currentTransform;
                });
            });
            
            skill.addEventListener("mouseleave", function (e) {
                console.log("Mouse left skill - will resume animation");
                isHoveringSkill = false;
                clearTimeout(mouseTimeout);
                // Pequeño delay para verificar si se movió a otra skill
                mouseTimeout = setTimeout(() => {
                    if (!isHoveringSkill) {
                        console.log("Resuming animation - no skill hovered");
                        isAnimating = true;
                        
                        // Reactivar transiciones suaves cuando se reanuda
                        skills.forEach(s => {
                            s.style.transition = 'all 0.3s ease-in-out';
                        });
                        
                        // Reiniciar el loop de animación
                        requestAnimationFrame(rotateEllipse);
                    }
                }, 50);
            });
        });
        
        
    }, 100);
});

// Function to load projetcs from JSON file
document.addEventListener('DOMContentLoaded', () => {
    fetch('../assets/projects.json')
        .then(response => response.json())
        .then(data => {
					const projectsContainer = document.querySelector(".projects");
					if (!projectsContainer) {
						console.error("Projects container not found!");
						return;
					}

					data.projects.forEach((project) => {
						const projectElement = document.createElement("li");
						projectElement.classList.add("project");

                        const projectLink = document.createElement("a");
                        projectLink.href = project.url || "#";
                        projectLink.target = "_blank";
                        projectElement.appendChild(projectLink);

						const projectImage = document.createElement("img");
						projectImage.src = project.image;
						projectImage.alt = project.name;

						const projectTitle = document.createElement("h2");
						projectTitle.innerText = project.title;

						const projectDescription = document.createElement("p");
						projectDescription.innerHTML = `<pre>${project.description}</pre>`;

						projectsContainer.appendChild(projectElement);

						projectElement.appendChild(projectLink);
                        projectLink.appendChild(projectImage);
						projectElement.appendChild(projectTitle);
						projectElement.appendChild(projectDescription);

						// Add technologies used
						if (project.technologies && project.technologies.length > 0) {
							const techList = document.createElement("ul");
							techList.classList.add("tech-list");
							project.technologies.forEach((tech) => {
								const techItem = document.createElement("li");
								techItem.className = `${tech.name
									.toLowerCase()
									.replace(/\s+/g, "")}`;
								techItem.innerHTML = `<i>${tech.icon}</i> ${tech.name}`;
								techList.appendChild(techItem);
							});
							projectElement.appendChild(techList);
						}
					});

					// Add hover effect to project images
					const projectImages = document.querySelectorAll(".project>a img");
					projectImages.forEach((image) => {
						image.addEventListener("mouseover", () => {
							image.style.transform = "scale(1.05)";
							image.style.transition = "transform 0.3s ease";
						});
						image.addEventListener("mouseout", () => {
							image.style.transform = "scale(1)";
						});
					});
				})
        .catch(error => console.error('Error loading projects:', error));

    
});