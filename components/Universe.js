import * as THREE from 'three'
import { useRef, useEffect } from 'react'

const Universe = function ({ id, metadata }) {
  let includes = `  
    #define NUM_OCTAVES 5
    
    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
    
    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);
    
        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);
    
        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);
    
        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));
    
        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    
        return o4.y * d.y + o4.x * (1.0 - d.y);
    }
    
    
    float fbm(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100);
      for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

  mat3 rotation3dX(float angle) {
      float s = sin(angle);
      float c = cos(angle);
    
      return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
      );
    }
    
    mat3 rotation3dY(float angle) {
      float s = sin(angle);
      float c = cos(angle);
    
      return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
      );
    }
    
    mat3 rotation3dZ(float angle) {
      float s = sin(angle);
      float c = cos(angle);
    
      return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
      );
    }

    // varying vec3 v_position;
    // varying vec3 v_normal;
    // varying vec2 v_uv;
    // varying mat3 v_rotation;

    // uniform float time;
    uniform vec3 lightColor1;
    uniform vec3 lightColor2;
    // uniform vec3 backgroundColor;
    uniform float radius;
    uniform float tubeThickness;
    uniform float innerWinds;
    uniform float outerWinds;
    uniform vec3 rotation;

  `

  let vert = `
      ${includes}

      uniform float time;
    
      varying vec3 v_position;
      varying vec3 v_normal;
      varying vec2 v_uv;
    
      void main () {
        vec3 newPosition = position;
    
        mat3 r = rotation3dZ(rotation.z * time);
        r *= rotation3dY(rotation.y * sin(time * 0.25));
        r *= rotation3dX(sin(position.y * rotation.x + time * 0.5));
    
        newPosition *= r;
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    
        v_position = newPosition;
        v_normal = normal * r;
        v_uv = uv;
      }
  `

  let frag = `

  ${includes}

	uniform float time;
	uniform sampler2D cat;
	uniform samplerCube cube;

	varying vec3 v_position;
	varying vec3 v_normal;
	varying vec2 v_uv;

	vec3 addLight(vec3 lightColor, vec3 lightPosition) {
		// ambient color
		float ambientStrength = 0.3;
		vec3 ambientColor = ambientStrength * lightColor;

		// diffuse color – matte color
		vec3 lightDirection = normalize(lightPosition - v_position);
		float diffuseStrength = 1.0;
		float diffuseScore = max(dot(lightDirection, v_normal), 0.0);
		vec3 diffuseColor = diffuseStrength * diffuseScore * lightColor;

		// specular color - gloss
		vec3 cameraDirection = normalize(cameraPosition - v_position);
		vec3 reflectionDirection = normalize(lightDirection + cameraDirection);
		float specularStrength = 5.5;
		float shininess = 12.0;
		float specularScore = pow(max(dot(reflectionDirection, v_normal), 0.0), shininess);
		vec3 specularColor = specularStrength * specularScore * lightColor;

		return (ambientColor + diffuseColor + specularColor);
	}

	void main () {
		vec3 dir = reflect(v_normal, vec3(0.0, 1.0, 0.0));
		dir = reflect(dir, vec3(1.0, 0.0, 0.0));

		vec3 cameraDirection = normalize(cameraPosition - v_position);

		vec3 wind = vec3(
			mix(-2.5, 2.5, fbm(0.1 * v_position + 0.1 * time)),
			mix(-2.5, 2.5, fbm(0.2 * v_position - 0.2 * time)),
			mix(-2.5, 2.5, fbm(0.3 * v_position + 0.3 * time))
		);

		float thickness = mix(-0.5, 0.5, fbm(0.1 * v_position + wind));

		vec3 rr = refract(cameraDirection, v_normal, 0.6 + thickness);
		vec3 rg = refract(cameraDirection, v_normal, 0.7 + thickness);
		vec3 rb = refract(cameraDirection, v_normal, 0.8 + thickness);

		vec4 rSample = textureCube(cube, rr);
		vec4 gSample = textureCube(cube, rg);
		vec4 bSample = textureCube(cube, rb);

		vec4 objectColor = vec4(rSample.r, gSample.g, bSample.b, 1.0);

		vec3 light1 = addLight(
			vec3(lightColor1.x, lightColor1.y, lightColor1.z),
			vec3(60.0 * cos(time), 60.0 * sin(time), 60.0)
		);

		vec3 light2 = addLight(
			vec3(lightColor2.x, lightColor2.y, lightColor2.z),
			vec3(100.0 * cos(time), 100.0 * sin(time), 0.0)
		);

		// final color
		vec4 color = vec4(
			(light1 + light2) * objectColor.rgb
		, 1.0);

		gl_FragColor = color;
	}

  `

  const universe = useRef()
  
  useEffect(() => { 
    let div = universe.current
    let anim

    if (div !== null && metadata.properties.hasOwnProperty("lightColor1")) {
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40 , div.clientWidth / div.clientHeight, 0.1, 100)

      renderer.setSize( div.clientWidth, div.clientHeight)
      renderer.setClearColor(0x000000, 0);

      div.innerHTML = ""
      div.append(renderer.domElement)

      const { properties } = metadata

      const clock = new THREE.Clock()
      const loader = new THREE.TextureLoader()
      const cubeLoader = new THREE.CubeTextureLoader()

      const uniforms = {
        time: { value: clock.getElapsedTime() },
        cat: { value: loader.load("/cat.jpg") },
        cube: { value: cubeLoader.load(["/posx.jpg", "/negx.jpg", "/posy.jpg", "/negy.jpg", "/posz.jpg", "/negz.jpg"])},
        displacement: { value: loader.load("/displacement1.jpg") },
        mainColor: { value: new THREE.Color(properties.mainColor) },
        lightColor1: { value: properties.lightColor1 },
        lightColor2: { value: properties.lightColor2 },
        radius: { value: properties.radius },
        tubeThickness: { value: properties.tubeThickness },
        innerWinds: { value: properties.innerWinds },
        outerWinds: { value: properties.outerWinds },
        rotation: { value: properties.rotation }
      }

      const dpi = 64
      const geometry = new THREE.TorusKnotGeometry(uniforms.radius.value, uniforms.tubeThickness.value, 10 * dpi, dpi, uniforms.innerWinds.value, uniforms.outerWinds.value)

      const material = new THREE.ShaderMaterial({ 
        uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag
      })
      const planet = new THREE.Mesh( geometry, material )
      
      scene.add( planet)

      camera.position.z = 7

      // load anim tween
      let aimCamera = new THREE.Vector3(0, 0, 35) 
      let currentCamera = new THREE.Vector3(0, 200, 100)
      let endCamera = new THREE.Vector3(0, -200, 100)
      camera.position.copy(currentCamera)
      

      const animate = () => {
        anim = requestAnimationFrame(animate)
        
        // load anim tween
        const diff = aimCamera.clone()
        .sub(currentCamera)
        .multiplyScalar(0.03)
        currentCamera.add(diff)
        camera.position.copy(currentCamera)

        uniforms.time = { value: clock.getElapsedTime() }

        // if (uniforms.time = 0.5) {
        //   const diff = aimCamera.clone()
        //   .sub(endCamera)
        //   .multiplyScalar(0.03)
        //   endCamera.add(diff)
        //   camera.position.copy(endCamera)
        // }

        renderer.render(scene, camera)
      }

      window.addEventListener("resize", function () {
        camera.aspect = div.clientWidth / div.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize( div.clientWidth, div.clientHeight)
      })

      animate()
    }     
    
    return () => cancelAnimationFrame(anim)
  }, [metadata, frag, vert])
    
  return (
    <>
      <div className="universe" ref={universe}></div>
    </>
  )
}

export default Universe;