import { generateId } from "@shipoff/services-commons";
import { dbService } from "./db-service";
import { Framework } from "@prisma/index";
import { logger } from "@/libs/winston";

async function seedFrameworks() {
    const frameworks: Framework[] = [
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "react-19.1.1",
            displayName: "React",
            keywordName: "react-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
            applicationType: "STATIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "N/A",
            defaultOutDir: "build"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "vite-7.1.1",
            displayName: "Vite",
            keywordName: "vite-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg",
            applicationType: "STATIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "N/A",
            defaultOutDir: "dist"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "vue-3.5.18",
            displayName: "Vue",
            keywordName: "vue-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
            applicationType: "STATIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "N/A",
            defaultOutDir: "dist"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "angular-20.1.6",
            displayName: "Angular",
            keywordName: "angular-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg",
            applicationType: "STATIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "N/A",
            defaultOutDir: "dist"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "svelte-5.38.1",
            displayName: "Svelte",
            keywordName: "svelte",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
            applicationType: "STATIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "N/A",
            defaultOutDir: "public/build"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "next-15.4.6",
            displayName: "Next.js",
            keywordName: "next-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "npm run start",
            defaultOutDir: ".next"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "express-5.1.0",
            displayName: "Express",
            keywordName: "express",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "npm run start",
            defaultOutDir: "defaultOutDir"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "nest-11.1.6",
            displayName: "NestJS",
            keywordName: "nest-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "npm run start",
            defaultOutDir: "dist"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "fastify-5.5.0",
            displayName: "Fastify",
            keywordName: "fastify",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "npm run start",
            defaultOutDir: "defaultOutDir"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "nuxt-4.0.3",
            displayName: "Nuxt.js",
            keywordName: "nuxt-js",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nuxtjs/nuxtjs-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "npm run build",
            runtime: "NODEJS",
            defaultProdCommand: "npm run start",
            defaultOutDir: ".output"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "django-5.2.5",
            displayName: "Django",
            keywordName: "django",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "python manage.py collectstatic --noinput",
            runtime: "PYTHON",
            defaultProdCommand: "gunicorn wsgi:application",
            defaultOutDir: "staticfiles"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "flask-3.1.1",
            displayName: "Flask",
            keywordName: "flask",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "pip install -r requirements.txt",
            runtime: "PYTHON",
            defaultProdCommand: "gunicorn app:app",
            defaultOutDir: "defaultOutDir"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "fastapi-0.116.1",
            displayName: "FastAPI",
            keywordName: "fastapi",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "pip install -r requirements.txt",
            runtime: "PYTHON",
            defaultProdCommand: "uvicorn main:app",
            defaultOutDir: "defaultOutDir"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "laravel-12.23.1",
            displayName: "Laravel",
            keywordName: "laravel",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "composer install --optimize-autoloader --no-dev",
            runtime: "PHP",
            defaultProdCommand: "php artisan serve",
            defaultOutDir: "public"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "symfony-7.3.2",
            displayName: "Symfony",
            keywordName: "symfony",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/symfony/symfony-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "composer install --optimize-autoloader --no-dev",
            runtime: "PHP",
            defaultProdCommand: "php -S localhost:8000 -t public",
            defaultOutDir: "public"
        },
        {
            frameworkId: generateId("Framework", { Framework: "fw" }),
            name: "lumen-5.8.0",
            displayName: "Lumen",
            keywordName: "lumen",
            icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lumen/lumen-original.svg",
            applicationType: "DYNAMIC",
            defaultBuildCommand: "composer install --optimize-autoloader --no-dev",
            runtime: "PHP",
            defaultProdCommand: "php -S localhost:8000 -t public",
            defaultOutDir: "public"
        }
    ];

    try {
        const res = await dbService.createFramework({
            data: frameworks
        })
        logger.info(`Seeded ${res.count} frameworks successfully.`);
    } catch (e: any) {
        logger.error(`Failed to seed frameworks: ${JSON.stringify(e, null, 2)}`);
    }
}

async function setOneActiveRepoPerProjectTrigger() {
    await dbService.getClient().$executeRawUnsafe(`CREATE OR REPLACE FUNCTION ensure_single_active_repo_per_project()
        RETURNS TRIGGER AS $$
        BEGIN 
         IF (NEW.isConnected = true) THEN
           UPDATE "Repository" 
           SET "isConnected" = false
           WHERE "projectId" = NEW."projectId"
           AND "repositoryId" <> NEW."repositoryId"
           AND "isConnected" = true
         END IF;
         RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER single_active_repo_per_project
        BEFORE INSERT OR UPDATE ON "Repository"
        FOR EACH ROW EXECUTE FUNCTION ensure_single_active_repo_per_project();
       `);
}

async function setRepoCleanupTrigger() {
    await dbService.getClient().$executeRawUnsafe(`
  CREATE OR REPLACE FUNCTION delete_repo_if_no_deployments_and_inactive()
  RETURNS TRIGGER AS $$
  DECLARE
    remaining_deployments INT;
    repo_active BOOLEAN;
  BEGIN
    SELECT COUNT(*) INTO remaining_deployments
    FROM "Deployment"
    WHERE "repositoryId" = OLD."repositoryId";

    SELECT "isConnected" INTO repo_active
    FROM "Repository"
    WHERE "repositoryId" = OLD."repositoryId";

    IF remaining_deployments = 0 AND repo_active = false THEN
      DELETE FROM "Repository"
      WHERE "repositoryId" = OLD."repositoryId";
    END IF;

    RETURN OLD;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER delete_repo_after_deployment_delete
  AFTER DELETE ON "Deployment"
  FOR EACH ROW
  EXECUTE FUNCTION delete_repo_if_no_deployments_and_inactive();
`);
}

async function seedContraints() {
        await setRepoCleanupTrigger();
        await setOneActiveRepoPerProjectTrigger();
        await setOneGithubActiveRepoConstraints();
        await setOneActiveRepoPerProject();
        console.log("Seeded constraints successfully.");
}

async function setOneGithubActiveRepoConstraints() {
    await dbService.getClient().$executeRawUnsafe(`-- 1️⃣ Only one active repo per GitHub Repo ID
      CREATE UNIQUE INDEX unique_active_repo_per_github
      ON "Repository" ("githubRepoId")
      WHERE "isConnected" = true;
    `)
}
async function setOneActiveRepoPerProject() {
    await dbService.getClient().$executeRawUnsafe(`-- 2️⃣ Only one active repo per Project ID
      CREATE UNIQUE INDEX unique_active_repo_per_project
      ON "Repository" ("projectId")
      WHERE "isConnected" = true;
    `)
}
async function seed() {
    console.log("Seeding database...");
    await seedFrameworks();
    await seedContraints();
    console.log("Database seeding completed.");
}