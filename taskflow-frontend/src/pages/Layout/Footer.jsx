const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-zinc-50 text-center dark:bg-neutral-700 lg:text-left">
            <div className="p-2 text-center text-surface dark:text-white">
                © {currentYear} Copyright - <a href="#!">openDev Mada</a>
            </div>
        </footer>
    )
}

export default Footer