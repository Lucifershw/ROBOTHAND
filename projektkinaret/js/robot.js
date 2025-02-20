document.addEventListener('DOMContentLoaded', () => {
    const robotFace = document.getElementById('robotFace');
    const leftEye = document.querySelector('.left-eye');
    const rightEye = document.querySelector('.right-eye');

    // Make the eyes follow the cursor
    document.addEventListener('mousemove', (e) => {
        const rect = robotFace.getBoundingClientRect();
        const faceCenterX = rect.left + rect.width / 2;
        const faceCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - faceCenterX;
        const deltaY = e.clientY - faceCenterY;

        const angle = Math.atan2(deltaY, deltaX);

        const eyeMovementDistance = 5;
        const offsetX = Math.cos(angle) * eyeMovementDistance;
        const offsetY = Math.sin(angle) * eyeMovementDistance;

        leftEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        rightEye.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    robotFace.addEventListener('click', () => {
        leftEye.classList.add('squint');
        rightEye.classList.add('squint');

        setTimeout(() => {
            leftEye.classList.remove('squint');
            rightEye.classList.remove('squint');
        }, 300);
    });
});
