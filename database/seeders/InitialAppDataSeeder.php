<?php

namespace Database\Seeders;

use App\Models\AppFont;
use App\Models\GeneralSetting;
use App\Models\Page;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InitialAppDataSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(
            ['name_role' => 'Administrator']
        );

        $pages = [
            ['page' => 'admin', 'icon' => 'fas fa-fw fa-tachometer-alt', 'path' => '/admin', 'order' => 1, 'page_id' => 0],
            ['page' => 'users', 'icon' => 'fas fa-fw fa-users', 'path' => '/users', 'order' => 2, 'page_id' => 0],
            ['page' => 'roles', 'icon' => 'fas fa-fw fa-user-tag', 'path' => '/roles', 'order' => 3, 'page_id' => 0],
            ['page' => 'pages', 'icon' => 'fas fa-fw fa-file', 'path' => '/pages', 'order' => 4, 'page_id' => 0],
            ['page' => 'permissions', 'icon' => 'fas fa-fw fa-key', 'path' => '/permissions', 'order' => 5, 'page_id' => 0],
            ['page' => 'app-fonts', 'icon' => 'fas fa-fw fa-font', 'path' => '/app-fonts', 'order' => 6, 'page_id' => 0],
            ['page' => 'general-settings', 'icon' => 'fas fa-fw fa-cog', 'path' => '/general-settings', 'order' => 7, 'page_id' => 0],
            ['page' => 'translates', 'icon' => 'fas fa-fw fa-language', 'path' => '/translates', 'order' => 8, 'page_id' => 0],
            ['page' => 'profile', 'icon' => 'fas fa-fw fa-user', 'path' => '/profile', 'order' => 9, 'page_id' => 0],
        ];

        foreach ($pages as $pageData) {
            $page = Page::updateOrCreate(
                ['page' => $pageData['page']],
                $pageData
            );

            Permission::updateOrCreate(
                [
                    'role_id' => $adminRole->id,
                    'page_id' => $page->id,
                ],
                [
                    'read' => 1,
                    'edit' => 1,
                    'create' => 1,
                    'update' => 1,
                    'delete' => 1,
                ]
            );
        }

        $font = AppFont::firstOrCreate(
            ['name_font' => 'Montserrat'],
            ['path' => '/app-assets/fonts/Montserrat-Regular.ttf']
        );

        GeneralSetting::firstOrCreate(
            ['id' => 1],
            [
                'font_id' => $font->id,
                'font_size' => 1,
                'logo' => '/app-assets/images/1679163509.png',
                'name' => 'Dashboard',
                'email' => 'admin@example.com',
                'facebook' => '#',
                'youtube' => '#',
            ]
        );

        User::whereNull('role_id')->update(['role_id' => $adminRole->id]);

        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Primary Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('115599'),
                'role_id' => $adminRole->id,
            ]
        );
    }
}
