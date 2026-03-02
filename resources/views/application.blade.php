<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=0.8">
    <meta name="author" content="PIXINVENT">
    <link rel="shortcut icon" href="{{ asset('favicon-32.png') }}">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600"
        rel="stylesheet">
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    @include('layouts.app-assets-head')
    @php
        $fontFamily = data_get($setting, 'font.name_font', 'Montserrat');
        $fontSize = data_get($setting, 'font_size', 1);
    @endphp
    <style>
        @foreach (($fonts ?? []) as $font )
            @font-face {
                        font-family: {{ $font->name_font }};
                        src: url({{( $font->path)}});
                    }
     @endforeach


        body {
            font-family: {{ $fontFamily }} !important;
            text-align: right !important;
            font-size: {{ $fontSize }}em !important;
        }
        @include('layouts.app-assets-style') table tr:nth-child(even) {
            background: #eef0f2;
        }
    </style>
</head>
@vite('resources/js/app.js')
<body class="vertical-layout vertical-menu-modern  navbar-floating footer-static  " data-open="click"
    data-menu="vertical-menu-modern" data-col="">
    <div id="app">
        <home-component /></home-component>
    </div>
    <div class="sidenav-overlay"></div>
    <div class="drag-target"></div>

    <button class="btn btn-success btn-icon scroll-top" type="button"><i data-feather="arrow-up"></i></button>
    @include('layouts.app-assets-script')
</body>
<script>
    document.body.style.direction = localStorage.getItem("direction") ? localStorage.getItem("direction") : 'rtl';
    document.body.style.textAlign = localStorage.getItem("textAlign") ? localStorage.getItem("textAlign") : 'right';
</script>
</html>
