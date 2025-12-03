This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Setup

This project uses Axios for HTTP requests with interceptors for authentication, and React Query (@tanstack/react-query) for data fetching and caching.

### Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_API_URL=https://api.sweethomes.com.ng/api/
```

### API Clients

Two Axios instances are configured in `lib/api.ts`:

- `userApiClient`: For normal user requests. Uses token stored in localStorage as 'user_token'.
- `adminApiClient`: For admin requests. Uses token stored in localStorage as 'admin_token'.

Both clients automatically add the Authorization header with Bearer token if available.

### React Query

React Query is set up with a QueryClient provider in `lib/providers.tsx`, wrapped in the root layout.

## Admin Dashboard

The admin dashboard provides a comprehensive interface for managing hotel operations.

### Accessing the Admin Dashboard

Navigate to `/admin/login` to access the admin login page.

### Admin Authentication

Admin authentication uses the following endpoints:

- **Login**: `POST /admin/login` (FormData with email and password)
- **Get Current User**: `GET /user/me` (requires Bearer token)

Token is stored in `localStorage` as `admin_token`.

### Admin Pages

| Route               | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `/admin/login`      | Admin login page with form validation                           |
| `/admin/dashboard`  | Analytics overview with stats, recent bookings, and room status |
| `/admin/rooms`      | Manage hotel rooms (view, add, edit, delete)                    |
| `/admin/amenities`  | Manage room amenities                                           |
| `/admin/facilities` | Manage hotel facilities                                         |
| `/admin/bookings`   | View and manage all reservations                                |

### Admin Project Structure

```
app/admin/
├── layout.tsx              # Admin root layout with providers
├── login/
│   └── page.tsx            # Login page
└── (dashboard)/
    ├── layout.tsx          # Protected dashboard layout with sidebar
    ├── dashboard/
    │   └── page.tsx        # Analytics dashboard
    ├── rooms/
    │   └── page.tsx        # Rooms management
    ├── amenities/
    │   └── page.tsx        # Amenities management
    ├── facilities/
    │   └── page.tsx        # Facilities management
    └── bookings/
        └── page.tsx        # Bookings management

components/admin/
└── Sidebar.tsx             # Responsive sidebar navigation

contexts/
└── AdminAuthContext.tsx    # Admin authentication context

hooks/
└── useAdminAuth.ts         # Admin authentication hooks

types/
└── admin.ts                # TypeScript types for admin
```

### Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Desktop sidebar can be collapsed; mobile uses slide-out drawer
- **Protected Routes**: Dashboard routes require authentication
- **Form Validation**: Login form with client-side validation
- **Search & Filter**: All listing pages support search and filtering
- **Status Indicators**: Color-coded status badges for rooms, bookings, and facilities

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# sweet-homes-frontend

## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/rpil/sweet-homes-frontend.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/rpil/sweet-homes-frontend/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
