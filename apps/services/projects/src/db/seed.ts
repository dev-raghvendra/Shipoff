import { generateId } from "@shipoff/services-commons";
import { dbService } from "./db-service";
import { Framework } from "@prisma/index";
import {logger} from "@shipoff/services-commons/libs/winston";

async function seedFrameworks(){
    const frameworks : Framework[] = [
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"react-19.1.1",
            displayName:"React",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            applicationType:"STATIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:null
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"vue-3.5.18",
            displayName:"Vue",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
            applicationType:"STATIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:null
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"angular-20.1.6",
            displayName:"Angular",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
            applicationType:"STATIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:null
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"svelte-5.38.1",
            displayName:"Svelte",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
            applicationType:"STATIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:null
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"next-15.4.6",
            displayName:"Next.js",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:"npm run start"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"express-5.1.0",
            displayName:"Express",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:"npm run start"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"nest-11.1.6",
            displayName:"NestJS",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:"npm run start"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"fastify-5.5.0",
            displayName:"Fastify",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:"npm run start"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"nuxt-4.0.3",
            displayName:"Nuxt.js",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"npm run build",
            runtime:"NODEJS",
            defaultProdCommand:"npm run start"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"django-5.2.5",
            displayName:"Django",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"python manage.py collectstatic --noinput",
            runtime:"PYTHON",
            defaultProdCommand:"gunicorn wsgi:application"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"flask-3.1.1",
            displayName:"Flask",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"pip install -r requirements.txt",
            runtime:"PYTHON",
            defaultProdCommand:"gunicorn app:app"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"fastapi-0.116.1",
            displayName:"FastAPI",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"pip install -r requirements.txt",
            runtime:"PYTHON",
            defaultProdCommand:"uvicorn main:app"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"laravel-12.23.1",
            displayName:"Laravel",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"composer install --optimize-autoloader --no-dev",
            runtime:"PHP",
            defaultProdCommand:"php artisan serve",
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"symfony-7.3.2",
            displayName:"Symfony",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/symfony/symfony-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"composer install --optimize-autoloader --no-dev",
            runtime:"PHP",
            defaultProdCommand:"php -S localhost:8000 -t public"
        },
        {
            frameworkId:generateId("Framework", {Framework:"fw"}),
            name:"lumen-5.8.0",
            displayName:"Lumen",
            icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lumen/lumen-original.svg",
            applicationType:"DYNAMIC",
            defaultBuildCommand:"composer install --optimize-autoloader --no-dev",
            runtime:"PHP",
            defaultProdCommand:"php -S localhost:8000 -t public"
        }
    ];
    try {
        const res = await dbService.createFramework({
            data: frameworks
        })
        logger.info(`Seeded ${res.count} frameworks successfully.`);
    } catch (e:any) {
        logger.error(`Failed to seed frameworks: ${JSON.stringify(e, null, 2)}`);
    }
}

seedFrameworks()

