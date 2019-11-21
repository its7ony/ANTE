package com.ante.ante.Retrofit;

import io.reactivex.Observable;

import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface ServiceRetrofit {
    @POST("login")
    @FormUrlEncoded
    Observable<String> logUser(@Field("user") String username,
                       @Field("password") String password);

    @POST("traerRutas")
    @FormUrlEncoded
    Observable<String> getRoutes(@Field("user") String username);

    @POST("updateOrder")
    @FormUrlEncoded
    Observable<String> updateRoutes(@Field("user") String username,
                                    @Field("estatus") String status);
}
