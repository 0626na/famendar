// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-gray-200 text-center p-4 mt-auto">
            <p>
                &copy; {new Date().getFullYear()} Famender. All rights reserved.
            </p>
        </footer>
    );
}
