export function downloadFiles(urls:string[]){
    const links: HTMLAnchorElement[] = []
    let currTimer = 0;
    urls.forEach((url)=>{
        console.log("Downloading from url:", url);
        const link = document.createElement('a');
        link.href = url;
        link.download = ''
        document.body.appendChild(link)
        links.push(link)
    })

    links.forEach((link)=>{
        setTimeout(() => {
            link.click()
            document.body.removeChild(link)
        }, currTimer);
        currTimer+=300
    })   
}