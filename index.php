<!DOCTYPE html>
<html lang="es">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="au theme template">
    <meta name="author" content="Hau Nguyen">
    <meta name="keywords" content="au theme template">

    <!-- Title Page-->
    <title>Stockeanding</title>

    <!-- Fontfaces CSS-->
    <link href="css/font-face.css" rel="stylesheet" media="all">
    <link href="vendor/font-awesome-4.7/css/font-awesome.min.css" rel="stylesheet" media="all">
    <link href="vendor/font-awesome-5/css/fontawesome-all.min.css" rel="stylesheet" media="all">
    <link href="vendor/mdi-font/css/material-design-iconic-font.min.css" rel="stylesheet" media="all">

    <!-- Bootstrap CSS-->
    <link href="vendor/bootstrap-4.1/bootstrap.min.css" rel="stylesheet" media="all">

    <!-- Vendor CSS-->
    <link href="vendor/animsition/animsition.min.css" rel="stylesheet" media="all">
    <link href="vendor/bootstrap-progressbar/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet" media="all">
    <link href="vendor/wow/animate.css" rel="stylesheet" media="all">
    <link href="vendor/css-hamburgers/hamburgers.min.css" rel="stylesheet" media="all">
    <link href="vendor/slick/slick.css" rel="stylesheet" media="all">
    <link href="vendor/select2/select2.min.css" rel="stylesheet" media="all">
    <link href="vendor/perfect-scrollbar/perfect-scrollbar.css" rel="stylesheet" media="all">

    <!-- Main CSS-->
    <link href="css/theme.css" rel="stylesheet" media="all">

    <link rel="shortcut icon" href="images/icon/logo-favicon.png" type="image/x-icon">
</head>

<body class="animsition">
    <div class="page-wrapper">
        <!-- HEADER MOBILE-->
        <header class="header-mobile d-block d-lg-none">
            <div class="header-mobile__bar">
                <div class="container-fluid">
                    <div class="header-mobile-inner">
                        <a class="logo" href="index.html">
                            <img src="images/icon/logo-prueba.png" alt="Logo" />
                        </a>
                        <button class="hamburger hamburger--slider" type="button">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <nav class="navbar-mobile">
                <div class="container-fluid">
                    <ul class="navbar-mobile__list list-unstyled">
                        <li>
                            <a href="index.html">
                                <i class="fas fa-chart-bar"></i>Inicio</a>
                        </li>
                        <li>
                            <a href="articulos.html">
                                <i class="fas fa-boxes"></i>Artículos</a>
                        </li>
                        <li>
                            <a href="depositos.html">
                                <i class="fas fa-warehouse"></i>Depósitos</a>
                        </li>
                        <li class="has-sub">
                            <a class="js-arrow" href="#">
                                <i class="fas fa-copy"></i>Existencias</a>
                            <ul class="navbar-mobile-sub__list list-unstyled js-sub-list">
                                <li>
                                    <a href="existencias_stock.html">
                                        <i class="fas fa-boxes"></i>Stock</a>
                                </li>
                                <li>
                                    <a href="existencias_movimientos.html">
                                        <i class="fas fa-shipping-fast"></i>Movimientos</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="informes.html">
                                <i class="fas fa-chart-line"></i>Informes</a>
                        </li>
                        <li>
                            <a href="usuarios.html">
                                <i class="fas fa-users"></i>Usuarios</a>
                        </li>
              
                    </ul>
                </div>
            </nav>
        </header>
        <!-- END HEADER MOBILE-->

        <!-- MENU SIDEBAR-->
        <aside class="menu-sidebar d-none d-lg-block">
            <div class="logo">
                <a href="#">
                    <img class="ml-4" style="max-width: 70%;" src="images/icon/logo-prueba.png" alt="Logo" />
                </a>
            </div>
            <div class="menu-sidebar__content js-scrollbar1">
                <nav class="navbar-sidebar">
                    <ul class="list-unstyled navbar__list">
                        <li class="active">
                            <a href="index.html">
                                <i class="fas fa-chart-bar"></i>Inicio</a>
                        </li>
                        <li id="item-articulos">
                            <a href="articulos.html">
                                <i class="fas fa-boxes"></i>Artículos</a>
                        </li>
                        <li id="item-depositos">
                            <a href="depositos.html">
                                <i class="fas fa-warehouse"></i>Depósitos</a>
                        </li>

                        <li id="item-existencias" class="has-sub">
                            <a class="js-arrow" href="#"> <i class="fas fa-clipboard-list"></i>Existencias</a>
                            <ul class="list-unstyled navbar__sub-list js-sub-list">
                                <li id="item-existencias-stock">
                                    <a href="existencias_stock.html"> <i class="fas fa-boxes"></i>Stock</a>
                                </li>
                                <li id="item-existencias-recpedidos">
                                    <a href="recepcion_pedido.html"> <i class="fas fa-sign-in-alt"></i>Recepción Pedidos</a>
                                </li>
                                <li id="item-existencias-rectraspasos">
                                    <a href="registrar_traspaso.html"> <i class="fas fa-sign-in-alt"></i>Recepción Traspasos</a>
                                </li>
                                <li id="item-existencias-gentraspaso">
                                    <a href="generacion_traspaso.html"> <i class="fas fa-sign-out-alt"></i>Generación Traspaso</a>
                                </li>
                            </ul>
                        </li>

                        <li id="item-informes" class="has-sub">
                            <a class="js-arrow" href="#"> <i class="fas fa-chart-line"></i>Informes</a>
                            <ul class="list-unstyled navbar__sub-list js-sub-list">
                                <li id="item-informes-stockdep">
                                    <a href="reporte_stock_deposito.html"> <i class="fas fa-pallet"></i>Stock por depósito</a>
                                </li>
                                <!--
                                <li id="item-informes-stockvencim">
                                    <a href="existencias_movimientos.html"> <i class="fas fa-shipping-fast"></i>Stock próximo a vencer</a>
                                </li>
                                -->
                                <li id="item-informes-movpordep">
                                    <a href="movimientos_por_deposito.html"> <i class="fas fa-shipping-fast"></i>Movimientos por depósito</a>
                                </li>
                                <li id="item-informes-movdep">
                                    <a href="movimientos_del_deposito.html"> <i class="fas fa-shipping-fast"></i>Movimientos del depósito</a>
                                </li>
                            </ul>
                        </li>

                        <li id="item-usuarios">
                            <a href="usuarios.html">
                                <i class="fas fa-users"></i>Usuarios</a>
                        </li>

                    </ul>
                </nav>
            </div>
        </aside>
        <!-- END MENU SIDEBAR-->

        <!-- PAGE CONTAINER-->
        <div class="page-container">
            <!-- HEADER DESKTOP-->
            <header class="header-desktop">
                <div class="section__content section__content--p30">
                    <div class="container-fluid">
                        <div class="header-wrap float-right">
                            <div class="header-button">
                                <!--
                                <div class="noti-wrap">
                                    <div class="noti__item js-item-menu">
                                        <i class="zmdi zmdi-notifications"></i>
                                        <span class="quantity">1</span>
                                        

                                        <div class="notifi-dropdown js-dropdown">
                                            <div class="notifi__title">
                                                <p>You have 1 Notifications</p>
                                            </div>

                                            <div class="notifi__item">
                                                <div class="bg-c1 img-cir img-40">
                                                    <i class="zmdi zmdi-email-open"></i>
                                                </div>
                                                <div class="content">
                                                    <p>Notificación de prueba</p>
                                                    <span class="date">April 12, 2018 06:50</span>
                                                </div>
                                            </div>

                                        </div>

                                        
                                    </div>
                                </div>
                                -->
                                <div class="account-wrap">
                                    <div class="account-item clearfix js-item-menu">
                                        
                                        <div class="content ml-0">
                                            <a class="lblUsuario" class="js-acc-btn" href="#">Usuario</a>
                                        </div>
                                        <div class="account-dropdown js-dropdown">
                                            <div class="info clearfix pb-0">
                                                <div class="image">
                                                    <a href="#">
                                                        <img src="images/icon/user-icon.png" alt="John Doe" />
                                                    </a>
                                                </div>
                                                <div class="content">
                                                    <h5 class="name">
                                                        <a class="lblUsuario" href="#">john doe</a>
                                                    </h5>
                                                    <span id="lblEmail" class="email">johndoe@example.com</span>
                                                    <span id="lblRol" style="color: rgb(148, 0, 0);" class="email">johndoe@example.com</span>
                                                </div>
                                            </div>
                                            <!--
                                            <div class="account-dropdown__body">
  
                                                <div class="account-dropdown__item">
                                                    <a href="#">
                                                        <i class="zmdi zmdi-money-box"></i>Item de prueba</a>
                                                </div>
                                            </div>
                                            -->
                                            <div class="account-dropdown__footer">
                                                <a id="btnLogout" href="#">
                                                    <i class="zmdi zmdi-power"></i>Cerrar sesión</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <!-- HEADER DESKTOP-->

            <!-- MAIN CONTENT-->
            <div class="main-content">
                <div class="section__content section__content--p30">
                    <div class="container-fluid">
                        <div class="col-md-12 d-flex justify-content-center pt-5 mt-5">
                            <img src="images/icon/logo-super-mami.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <!-- END MAIN CONTENT-->
            <!-- END PAGE CONTAINER-->
        </div>

    </div>

    <!-- Jquery JS-->
    <script src="vendor/jquery-3.2.1.min.js"></script>
    <!-- Bootstrap JS-->
    <script src="vendor/bootstrap-4.1/popper.min.js"></script>
    <script src="vendor/bootstrap-4.1/bootstrap.min.js"></script>
    <!-- Vendor JS       -->
    <script src="vendor/slick/slick.min.js">
    </script>
    <script src="vendor/wow/wow.min.js"></script>
    <script src="vendor/animsition/animsition.min.js"></script>
    <script src="vendor/bootstrap-progressbar/bootstrap-progressbar.min.js">
    </script>
    <script src="vendor/counter-up/jquery.waypoints.min.js"></script>
    <script src="vendor/counter-up/jquery.counterup.min.js">
    </script>
    <script src="vendor/circle-progress/circle-progress.min.js"></script>
    <script src="vendor/perfect-scrollbar/perfect-scrollbar.js"></script>
    <script src="vendor/chartjs/Chart.bundle.min.js"></script>
    <script src="vendor/select2/select2.min.js">
    </script>

    <!-- Main JS-->
    <script src="js/main.js"></script>
    <script src="js/session.js"></script>
    <script src="js/configuration.js"></script>

</body>

</html>
<!-- end document-->
