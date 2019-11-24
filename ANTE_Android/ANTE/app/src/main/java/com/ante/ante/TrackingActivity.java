package com.ante.ante;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.ante.ante.Retrofit.ClientRetrofit;
import com.ante.ante.Retrofit.ServiceRetrofit;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import java.net.URISyntaxException;

import com.google.android.gms.common.api.GoogleApi;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONException;
import org.json.JSONObject;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Retrofit;

public class TrackingActivity extends AppCompatActivity implements OnMapReadyCallback {

    //Declaring necessary stuff for later
    private Button btn_asies;
    private GoogleMap mMap;
    private String usuarioGlob= "";
    private CompositeDisposable compositeDisposable = new CompositeDisposable();
    private ServiceRetrofit serviceRetrofit;
    private String rute = "";
    private JSONObject obj;
    private LocationManager locationManager;
    private LocationListener locationListener;
    private int statusRuta = 0;
    //Socket declaration + location
    private Socket mSocket;

    {
        try {
            mSocket = IO.socket("http://192.168.43.243:3000");
        } catch (URISyntaxException e) {
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tracking);
        //Shit from other activity
        usuarioGlob = getIntent().getExtras().getString("user");
        //Need that btn
        btn_asies = findViewById(R.id.btn_asies);

        //Retrofit shite to get route
        Retrofit clientRetrofit = ClientRetrofit.getInstance();
        serviceRetrofit = clientRetrofit.create(ServiceRetrofit.class);

        //Getting the route id for wtv reason
        String ruta = traerRuta(usuarioGlob);
        try {
            obj = new JSONObject(ruta);
            Log.e("esta", obj.getString("idRuta"));
            rute = obj.getString("idRuta");
        } catch (JSONException e) {
            Log.e("MYAPP", "unexpected JSON exception", e);
        }

        //LOCATION LOCATION LOCATION
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                mSocket.connect();
                String objeto = "{\"name\":" + "'" + usuarioGlob + "'" + ",\"lat\":" + location.getLatitude() +",\"statusRuta\":" + statusRuta +",\"lng\":" + location.getLongitude() + "}";
                mSocket.emit("sendLocation", objeto);
                if(statusRuta == 2){locationManager.removeUpdates(locationListener);}
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                startActivity(intent);
            }
        };
        if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.INTERNET
            }, 10);
            return;
        }else{
            startLocation();
        }
        //Mapping stuff
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(21.150908, -101.71110470000002);
        mMap.addMarker(new MarkerOptions().position(sydney).title("Comienzo"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(sydney ,18));
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch(requestCode){
            case 10:
                if(grantResults.length>0 && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                    startLocation();
        }
    }

    private void startLocation() {

        btn_asies.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (statusRuta == 0){
                locationManager.requestLocationUpdates("gps", 100, 0, locationListener);
                statusRuta = 1;
                actualizarRuta(usuarioGlob);
                btn_asies.setText("Terminar");
                }else{
                    statusRuta = 2;
                    Toast.makeText(TrackingActivity.this, "picasion", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private String traerRuta(String us) {
        compositeDisposable.add(serviceRetrofit.getRoutes(us)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Consumer<String>() {
                    @Override
                    public void accept(String s) throws Exception {
                        rute = s;
                    }
                }));
        return rute;
    }

    private void actualizarRuta(String user) {
        compositeDisposable.add(serviceRetrofit.updateRoutes(user)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Consumer<String>() {
                    @Override
                    public void accept(String s) throws Exception {
                    }
                }));
    }
}