<?php

use App\Models\Page;

    function get_permission($pages, $permission)
    {
    $user = auth()->user();

    if (!$user) {
      return false;
    }

    $pageId = Page::where('page', $pages)->value('id');

    if (!$pageId) {
      return true;
    }

    if (!$user->role) {
      return true;
    }

    return $user->role->permissions()
      ->where('page_id', $pageId)
      ->where($permission, 1)
      ->exists();
    }

