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

import org.json.JSONException;
import org.json.JSONObject;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import retrofit2.Retrofit;

public class TrackingActivity extends AppCompatActivity {

    //Declaring necessary stuff for later
    private Button btn_asies;
    private CompositeDisposable compositeDisposable = new CompositeDisposable();
    private ServiceRetrofit serviceRetrofit;
    private String rute = "";
    private JSONObject obj;
    private LocationManager locationManager;
    private LocationListener locationListener;

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
        final String user = getIntent().getExtras().getString("user");
        //Need that btn
        btn_asies = findViewById(R.id.btn_asies);

        //Retrofit shite to get route
        Retrofit clientRetrofit = ClientRetrofit.getInstance();
        serviceRetrofit = clientRetrofit.create(ServiceRetrofit.class);

		//Connection w socket
		mSocket.connect();

        //Getting the route id for wtv reason
        String ruta = traerRuta(user);
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
                String objeto = "{\"name\":" + "'" + user + "'" + ",\"lat\":" + location.getLatitude() + ",\"lng\":" + location.getLongitude() + "}";
                mSocket.emit("sendLocation", objeto);
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
                locationManager.requestLocationUpdates("gps", 5000, 0, locationListener);
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
                        Toast.makeText(TrackingActivity.this, s, Toast.LENGTH_SHORT).show();
                    }
                }));
        return rute;
    }

    private void actualizarRuta(String user, String status) {
        compositeDisposable.add(serviceRetrofit.updateRoutes(user, status)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Consumer<String>() {
                    @Override
                    public void accept(String s) throws Exception {
                        rute = s;
                        Toast.makeText(TrackingActivity.this, s, Toast.LENGTH_SHORT).show();
                    }
                }));
    }
}