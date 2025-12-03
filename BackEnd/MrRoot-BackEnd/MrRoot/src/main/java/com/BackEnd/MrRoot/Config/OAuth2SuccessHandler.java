package com.BackEnd.MrRoot.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;


    public OAuth2SuccessHandler(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)throws IOException{
        DefaultOAuth2User user = (DefaultOAuth2User) authentication.getPrincipal();
        String email = user.getAttribute("email");

        String token = jwtUtils.generateToken(email);
        System.out.println("Token is: "+token);
        System.out.println("Email :"+email);
        response.sendRedirect("http://localhost:5173/map?token=" + token);
    }


}
